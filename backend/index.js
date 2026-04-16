const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const Mutex = require('./services/Mutex.js');
const Users = require('./services/Users.js');
const AuthMiddleware = require('./middleware/Auth.js');
const LobbyController = require('./services/LobbyController.js');
const GameController = require('./services/GameController.js');

const mutex = new Mutex();
const PORT = 3001; // Puerto
const app = express();

const servidor = http.createServer(app);
const{ Server } = require('socket.io');
const io = new Server(servidor, {
    cors: {
        origin: "*"
    }
});

app.use(cors({
    origin: "*"
}));

//inicializacion de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Metodos HTTP
//-------------------------------- GET --------------------------------//
app.get('/me', AuthMiddleware.validateJWT, function(req, res) {
    res.status(200).json({ token: true, message: "Valid token", user: req.user });
});

//-------------------------------- POST --------------------------------//
app.post('/auth', async function (req, res) {
    const { email, password } = req.body;
    var data = await Users.loggin(email, password);

    if (data.isError) {
        return res.status(400).json({ token: "null", data });
    }

    const user = data.user;
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
    );

    res.status(200).json({ token, data });
});

app.post('/register', async function (req, res) {
    const { name, username, email, password } = req.body;
    var data = await Users.register(email, name, username, password);

    if (data.isError) {
        res.status(400).json(data);
    } else {
        res.status(200).json(data);
    }
});

app.post('/logout', async function(req, res) {
    //por ver
});

//-------------------------------- PUT --------------------------------//


//-------------------------------- DELETE --------------------------------//


//-------------------------------- SOCKETS --------------------------------//
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("No token"));
    }

    try {
        const user = jwt.verify(token, process.env.JWT_KEY);
        socket.user = user;
        socket.actualSeat = null;
        console.log(`[LOG]: Socket user ${socket.user.username} connected`);
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on('connection', (socket) => {
    socket.emit('render-lobby', LobbyController.GetTables());

    socket.on('add-to-table', async (seat) => {
        if (!LobbyController.isValidSeat(seat)) {
            socket.emit('error-found', {code: 400, message: "Datos de mesa invalidos."});
            return;
        }

        await mutex.lock();
        var inserted = LobbyController.RegisterPlayerInTable(socket.user, socket.actualSeat, seat);
        mutex.unlock()

        if (inserted.code == 200) {
            console.log("[LOG]: " + inserted.message);
            socket.actualSeat = seat;
            socket.join(`table_${socket.actualSeat.table}`);
            io.emit('render-lobby', LobbyController.GetTables());
        } else {
            console.log("[LOG]: " + inserted.message);
            socket.emit('error-found', inserted);
        }

    });

    socket.on('remove-from-table', async () => {
        if (!socket.actualSeat) {
            const error = {code: 400, message: `Error removing player ${socket.user.username}: actual seat not found.`};
            console.log("[LOG]: " + error.message);
            socket.emit('error-found', error);
            return;
        }

        await mutex.lock();
        var removed = LobbyController.RemovePlayerFromTable(socket.user, socket.actualSeat.team, socket.actualSeat.table, socket.actualSeat.pos);
        mutex.unlock();

        if (removed.code == 200) {
            console.log("[LOG]: " + removed.message);
            socket.leave(`table_${socket.actualSeat.table}`);
            socket.actualSeat = null;
            io.emit('render-lobby', LobbyController.GetTables());
        } else {
            console.log("[LOG]: " + removed.message);
            socket.emit('error-found', removed);
        }
    });

    socket.on('init-game', (data) => {
        var table = LobbyController.GetTableById(data.table);
        if (table.IsRoomReady()) {
            var players = LobbyController.GetPlayersByTable(data.table);
            var game_id = GameController.RegisterNewGame(data.table, players);
            io.sockets.emit('init-game', data.table, players, game_id);
        }
    });

    socket.on('prepare-game', (id) => {
        var players = LobbyController.GetPlayersByTable(id);
        GameController.PrepareGameForTable(id);
    })

    socket.on('disconnecting', async () => {
        if (socket.actualSeat) {
            await mutex.lock();
            var removed = LobbyController.RemovePlayerFromTable(
                socket.user,
                socket.actualSeat.team,
                socket.actualSeat.table,
                socket.actualSeat.pos
            );
            mutex.unlock();
            console.log("[LOG]: " + removed.message);
            io.emit('render-lobby', LobbyController.GetTables());
        }
        console.log(`[LOG]: socket user ${socket.user.username} disconnected`);
    });
});

//-------------------------------- INIT --------------------------------//
servidor.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        server.close();
    });
}
