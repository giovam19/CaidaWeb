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

const Users = require('./services/users.js');
const LobbyController = require('./services/LobbyController.js');


const PORT = 3000; // El puerto en el que deseas ejecutar el servidor

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
    res.status(200).json(LobbyController.getTables());
});
app.get('/mesa', verificarAutenticacion, function(req, res) {
    res.render('mesa');
});
app.get('/logout', function(req, res) {
    var user = req.user;
    req.logout(function(err) {
        if (err) {
            console.error('Error al cerrar sesión: ', err);
        }
        
        LobbyController.removePlayerFromTable(user);
        res.redirect('/');
    });
});

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

app.put('/room', (req, res) => {
    var inserted = LobbyController.registerPlayerInRoom(req.user, req.body.mesa, req.body.team, req.body.pos);

    var response = {
        code: inserted ? 200 : 400,
        message: inserted ? 'Ingresado' : 'No se pudo ingresar'
    };
    res.json(response);
});

app.delete('/room', (req, res) => {
    LobbyController.removePlayerFromTable(req.user);
    res.json({ code: 200, message: 'Saliste de la mesa' });
});

//Sockets
io.on('connection', (socket) => {
    console.log('$ user connected: ', socket.handshake.auth.user);

    socket.emit('rooms', LobbyController.getTables());

    socket.on('update-room', (data) => {
        socket.broadcast.emit('update-room', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Iniciar el servidor
/*const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});*/
servidor.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        server.close();
    });
}
