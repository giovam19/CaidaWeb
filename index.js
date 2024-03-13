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

const mutex = new Mutex();
const PORT = 3000; // Puerto

// Configuración del middleware de flash
app.use(flash());

app.use(cookieParser('#estascaidosapo91'));

// Configuración del middleware de sesión
app.use(session({
    secret: '#estascaidosapo91',
    resave: true,
    saveUninitialized: true,
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
            return done(null, data.user);
        } else {
            return done(null, false, { message: data.message });
        }
    });
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

//Metodos HTTP
//-------------------------------- GET --------------------------------//
app.get('/', (req, res) => {
    res.render('login', { message: req.flash('error') });
});
app.get('/register', (req, res) => {
    res.render('register', { res_obj: {} });
});
app.get('/lobby', verificarAutenticacion, function(req, res) {
    res.render('lobby', { user: req.user });
});
app.get('/rooms/users', verificarAutenticacion, function(req, res) {
    res.status(200).json(LobbyController.GetRooms());
});
app.get('/mesa', verificarAutenticacion, function(req, res) {
    res.render('mesa');
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
        removed = LobbyController.RemovePlayerFromTable(req.user, req.body.data.team, req.body.data.table, req.body.data.pos);
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
            console.log("Sesion cerrada!");
            res.json({ code: 200, message: 'Sesión cerrada' });
        }
    });
});

//-------------------------------- PUT --------------------------------//
app.put('/room', async function (req, res) {
    await mutex.lock();
    var inserted = LobbyController.RegisterPlayerInRoom(req.user, req.body.regData, req.body.prevData);
    mutex.unlock();
    res.json(inserted);
});

//-------------------------------- DELETE --------------------------------//
app.delete('/room', async function (req, res) {
    await mutex.lock();
    var removed = LobbyController.RemovePlayerFromTable(req.user, req.body.team, req.body.table, req.body.pos);
    mutex.unlock();
    res.json(removed);
});

//-------------------------------- SOCKETS --------------------------------//
io.on('connection', (socket) => {
    console.log('$ user connected: ', socket.handshake.auth.user);

    socket.emit('rooms', LobbyController.GetRooms());

    socket.on('update-room', (data) => {
        socket.broadcast.emit('update-room', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
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
