const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const Mutex = require('./services/Mutex');
const Users = require('./services/Users');
const LogManager = require('./services/Logs');
const AuthMiddleware = require('./middleware/Auth');
const LobbyController = require('./controllers/LobbyController');
const GameController = require('./controllers/GameController');
const LobbySockets = require('./sockets/lobby.js');

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

app.post('/checkGame', function (req, res) {
    const params = req.body;
    var game = GameController.CheckGameId(params.id, params.gameId);

    if (game) {
        res.status(200).json(game);
    } else {
        res.status(400).json(null);
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
        LogManager.printInfo(`Socket user ${socket.user.username} connected`);
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on('connection', async (socket) => {
    socket.emit('render-lobby', LobbyController.GetTables());

    await LobbySockets.logic(io, socket, mutex, LobbyController, GameController);

    socket.on('disconnecting', async () => {
        await LobbySockets.disconnect(io, socket, mutex, LobbyController);
        LogManager.printInfo(`Socket user ${socket.user.username} disconnected`);
    });
});

//-------------------------------- INIT --------------------------------//
servidor.listen(PORT, "0.0.0.0", () => {
    LogManager.printInfo(`Servidor escuchando en el puerto ${PORT}`);
});

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        server.close();
    });
}
