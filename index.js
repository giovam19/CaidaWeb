const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const Users = require('./services/users.js');
const app = express();

const PORT = 3000; // El puerto en el que deseas ejecutar el servidor

passport.use(new LocalStrategy(
    function (username, password, done) {
        Users.loggin(username, password).then(data => {
            if (!data.isError) {
                return done(null, data.user);
            } else {
                return done(null, false, { message: data.message });
            }
        });
    }
));

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

// Configuración del middleware de flash
app.use(flash());

// Configuración del middleware de sesión
app.use(session({
    secret: '#estascaidosapo91',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 7200000
    }
}));

// Middleware de inicialización de Passport.js
app.use(passport.initialize());
app.use(passport.session());

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

// Configuración de rutas
app.get('/', (req, res) => {
    res.render('login', { message: req.flash('error') });
});
app.get('/register', (req, res) => {
    res.render('register', { res_obj: {} });
});
app.get('/lobby', (req, res) => {
    res.render('lobby');
});
app.get('/mesa', (req, res) => {
    res.render('mesa');
});
/*app.get('/lobby', verificarAutenticacion, function(req, res) {
    res.render('lobby');
});*/
/*app.get('/mesa', verificarAutenticacion, function(req, res) {
    res.render('mesa');
});*/

app.post('/auth', passport.authenticate('local', {
    successRedirect: '/lobby',
    failureRedirect: '/',
    failureFlash: true
}));
/*app.post('/auth', async function (req, res) {
    const { email, password } = req.body;
    const data = await Users.loggin(email, password);
    if (data) {
        res.redirect('/lobby');
        console.log("Usuario logeado");
    } else {
        res.redirect('/');
        console.log("Usuario no logeado");
    }
});*/
app.post('/register', async function (req, res) {
    const { name, username, email, password } = req.body;
    var data = await Users.register(email, name, username, password);

    res.render('register', { res_obj: data });
});


// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        server.close();
    });
}
