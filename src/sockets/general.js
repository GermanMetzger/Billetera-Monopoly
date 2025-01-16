const os = require('os');
module.exports = (io, socket) => {

    var partidaCreada = false;

    
    
    socket.on('crear', (msg)=>{
        if (!partidaCreada) {
            partidaCreada = true;
            const ip = "http://"+obtenerIpLocal()+":3000";
            const codigoSala = Math.random().toString(36).substr(2, 9);
            const link = ip+"?codigo="+codigoSala+"&unirse=true";
            
            socket.join(codigoSala);
            
            const nombre = msg.nombre;
            const id = msg.id;
            const host = msg.host;
            console.log(msg);
            console.log("El Banquero "+nombre+" con el id "+id+" creo la sala con el codigo: "+codigoSala);

            io.to(codigoSala).emit('quitarHeader',link);
            io.to(codigoSala).emit('cargarLink',link);
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
    io.to(codigoSala).emit('comprobarJugadores',datos);

    })

    socket.on('compartir', (jugadores)=>{
        jugadores.forEach(jugador=>{
            codigoSala = jugador.codigoSala;
        })
        io.to(codigoSala).emit('actualizarJugadores', jugadores);
    
    })







}

function obtenerIpLocal() {
    const interfaces = os.networkInterfaces();
    for (let nombre in interfaces) {
        for (let interfaz of interfaces[nombre]) {
            if (interfaz.family === 'IPv4' && !interfaz.internal) {
                return interfaz.address;
            }
        }
    }
    return null;
}