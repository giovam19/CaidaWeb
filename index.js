const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const path = require('path');
const http = require('http');

const app = express();

const servidor = http.createServer(app);
const{ Server } = require('socket.io');
const io = new Server(servidor);

const Mutex = require('./services/Mutex.js');
const Users = require('./services/users.js');
const LobbyController = require('./services/LobbyController.js');
const GameController = require('./services/GameController.js');
const { nextTick } = require('process');

const mutex = new Mutex();
const PORT = 3000; // Puerto

// Configuración del middleware de flash
app.use(flash());

app.use(cookieParser('#estascaidosapo91'));

// Configuración del middleware de sesión
app.use(session({
    secret: '#estascaidosapo91',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000, //duracion de la sesion 24h
    }
}));

// Middleware de inicialización de Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' },function (email, password, done) {
    Users.loggin(email, password).then(data => {
        if (!data.isError) {
            console.log('Usuario logeado: ', data.user.username);
            return done(null, data.user);
        } else {
            return done(null, false, { message: data.message });
        }
    }).catch(err => {
        return done(err);
    })
}));

passport.serializeUser(function (user, done) {
    done(null, { id: user.id, username: user.username, email: user.email });
});

passport.deserializeUser(function (userData, done) {
    const user = {
        id: userData.id,
        username: userData.username,
        email: userData.email
    };
    
    done(null, user);
});

//inicializacion de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/res', express.static(path.join(__dirname, '/public/res')));
app.use('/', express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

function verificarAutenticacion(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.redirect('/');
}

function verificarAutenticacionJson(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.status(404).json('Not Authenticated');
}

function verificarEntradaMesa(req, res, next) {
    if (req.isAuthenticated()) { //añadir verificaion de juego actual
        return next();
    }
    
    res.redirect('/lobby');
}

//Metodos HTTP
//-------------------------------- GET --------------------------------//
app.get('/', (req, res) => {
    res.render('login', { message: req.flash('error') });
});
app.get('/register', (req, res) => {
    res.render('register', { res_obj: {} });
});
app.get('/lobby', verificarAutenticacion, function(req, res) {
    io.use((socket, next) => {
        if (req.user) {
            socket.user = req.user;
        }
        next();
    });

    res.render('lobby', { user: req.user });
});
app.get('/mesa/:id', verificarEntradaMesa, function(req, res) {
    io.use((socket, next) => {
        if (req.user) {
            socket.user = req.user;
        }
        next();
    });
    let id = req.params.id;
    res.render('mesa', { id: id });
});
app.get('/data/user', verificarAutenticacionJson, function(req, res) {
    res.status(200).json(req.user);
});

//-------------------------------- POST --------------------------------//
app.post('/auth', passport.authenticate('local', {
    successRedirect: '/lobby',
    failureRedirect: '/',
    failureFlash: true
}));
app.post('/register', async function (req, res) {
    const { name, username, email, password } = req.body;
    var data = await Users.register(email, name, username, password);

    res.render('register', { res_obj: data });
});
app.post('/logout', async function(req, res) {
    var removed = null;
    if (req.body.data) {
        await mutex.lock();
        removed = LobbyController.RemovePlayerFromTable(req.body.data.team, req.body.data.table, req.body.data.pos);
        mutex.unlock();
    }

    req.logout(function(err) {
        if (removed && removed.code == 400) {
            console.error(removed.message);
            res.json(removed);
        } else if (err) {
            console.error(err.message);
            res.json({ code: 400, message: err.message });
        } else {
            console.log('Sesión cerrada');
            res.json({ code: 200, message: 'Sesión cerrada' });
        }
    });
});

//-------------------------------- PUT --------------------------------//


//-------------------------------- DELETE --------------------------------//


//-------------------------------- SOCKETS --------------------------------//
io.on('connection', (socket) => {
    if (socket.user) {
        console.log(`socket user connected: ${socket.user.username}`);
    }

    socket.emit('load-rooms', LobbyController.GetTables());

    socket.on('add-to-table', async (newData, prevData) => {
        await mutex.lock();
        var inserted = LobbyController.RegisterPlayerInTable(socket.user, socket.id, newData, prevData);
        mutex.unlock()

        socket.emit('add-to-table', inserted, newData, prevData)
    });

    socket.on('remove-from-table', async (prevData) => {
        await mutex.lock();
        var removed = LobbyController.RemovePlayerFromTable(prevData.team, prevData.table, prevData.pos);
        mutex.unlock();

        socket.emit('remove-from-table', removed, prevData)
    });

    socket.on('update-room', (data) => {
        socket.broadcast.emit('update-room', data);
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

    socket.on('disconnect', () => {
        console.log('socket user disconnected');
    });
});


//-------------------------------- INIT --------------------------------//
servidor.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        server.close();
    });
}

