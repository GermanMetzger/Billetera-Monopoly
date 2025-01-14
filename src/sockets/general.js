module.exports = (io, socket) => {

    var partidaCreada = false;
    
    
    
    socket.on('crear', (msg)=>{
        if (!partidaCreada) {
            partidaCreada = true;


            const codigoSala = Math.random().toString(36).substr(2, 9);


            socket.join(codigoSala);
            
            
            const nombre = msg.nombre;
            const id = msg.id;
            const rol = msg.rol;
            console.log("El Banquero "+nombre+" con el id "+id+" creo la sala con el codigo: "+codigoSala);
            
            io.to(codigoSala).emit('codigoDeSala',{codigo:codigoSala});
        } else {
            socket.emit('error', 'No se pudo crear la sala');
        }
   
  
    })

    socket.on('unirse', (datos)=>{
    const nombre = datos.nombre;
    const codigoSala = datos.codigoSala;
    socket.join(codigoSala);
    console.log("El jugador "+nombre+" con el id "+socket.id+" se une a la sala con el codigo: "+codigoSala);
    io.to(codigoSala).emit('comprobarJugadores');

    })






}