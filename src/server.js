const express = require('express');
const app = express();



//------------SOCKET.io-------------------------
const http = require('http');  // Necesario para usar Socket.IO con Express
const { Server } = require('socket.io');  // Importa Socket.IO
const server = http.createServer(app);  // Crea el servidor HTTP
const io = new Server(server);  // Asocia Socket.IO al servidor
const socketGeneral = require('./sockets/general'); // Archivo para manejar los sockets

io.on('connection', async (socket)=>{
    console.log(`Socket ${socket.id} conectado`);
    socketGeneral(io, socket);
    socket.on('disconnect',()=>{console.log(`Socket ${socket.id} se desconecto`);});
});



//------------MOTOR EJS---------------------
app.set('view engine', 'ejs');

// Configurar carpeta "public" para archivos estáticos
app.use(express.static('public'));

// Ruta básica que renderiza una plantilla EJS
app.get('/', (req, res) => {
    res.render('index');  // Renderiza 'index.ejs' desde la carpeta 'views'
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server corriendo en http://localhost:${port}`);
});