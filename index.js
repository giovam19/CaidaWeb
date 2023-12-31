const express = require('express');
const app = express();
const path = require('path');
const Users = require('./services/users.js');
const e = require('express');

const PORT = 3000; // El puerto en el que deseas ejecutar el servidor

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/res', express.static(path.join(__dirname, '/public/res')));
app.use('/', express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Configuración de rutas
app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, '/src/pages/index.html'));
    res.render('login');
});
app.get('/register', (req, res) => {
    //res.sendFile(path.join(__dirname, '/src/pages/register.html'));
    res.render('register');
});
app.get('/lobby', (req, res) => {
    res.render('lobby');
});

//rutas bbdd
app.post('/auth', async function (req, res) {
    const { email, password } = req.body;
    const data = await Users.loggin(email, password);
    if (data) {
        res.redirect('/lobby');
    } else {
        res.redirect('/');
    }
});
app.post('/register', async function (req, res) {
    const { name, username, email, password } = req.body;
    const data = await Users.register(email, name, username, password);
    if (data === 0) {
        res.redirect('/');
    } else {
        res.redirect('/register');
    }
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
