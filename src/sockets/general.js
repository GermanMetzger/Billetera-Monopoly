

module.exports = (io, socket) => {
    socket.on('ping', (msg)=>{
        console.log('Ping recibido:', msg);
        socket.emit('pong', 'Pong desde el servidor');
    })
}