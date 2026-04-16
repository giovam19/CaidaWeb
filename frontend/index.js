const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const servidor = http.createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/register.html'));
});

app.get('/lobby', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/lobby.html'));
});

app.get('/mesa/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/mesa.html'));
});

// init
servidor.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});