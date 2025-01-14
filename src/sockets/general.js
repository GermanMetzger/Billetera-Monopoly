module.exports = (io, socket) => {

    var partidaCreada = false;
    
    
    
    socket.on('crear', (msg)=>{
        if (!partidaCreada) {
            partidaCreada = true;


            const codigoSala = Math.random().toString(36).substr(2, 9);


            socket.join(codigoSala);
            console.log(msg)


            const nombre = msg.nombre;
            const id = msg.id;
            const rol = msg.rol;
            
            io.to(codigoSala).emit('quitarHeader');
        } else {
            socket.emit('error', 'No se pudo crear la sala');
        }
   
  
    })

    socket.on('unirse', (msg)=>{
    

    })






}