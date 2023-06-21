const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000; // El puerto en el que deseas ejecutar el servidor

app.use('/res', express.static(path.join(__dirname, '/res')));
app.use('/css', express.static(path.join(__dirname, '/src/css')));

// Configuración de rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/pages/index.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/pages/register.html'));
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
