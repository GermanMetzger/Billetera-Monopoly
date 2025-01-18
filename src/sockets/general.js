const os = require('os');
const Jugador = require('../clases/Jugador'); // Importa la clase
let jugadores = []; // Este arreglo contendrá las instancias de Jugador
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
module.exports = (io, socket) => {

    var partidaCreada = false;

    socket.on('crear', (creador)=>{
        if (!partidaCreada) {
            partidaCreada = true;
            const ip = "http://"+obtenerIpLocal()+":3000";
            const codigoSala = Math.random().toString(36).substr(2, 9);
            const link = ip+"?codigo="+codigoSala+"&unirse=true";
            
            socket.join(codigoSala);
            
            const nombre = creador.nombre;
            const id = creador.id;
            const host = creador.host;
            const color = "FFFFFF"
            console.log(creador);
            console.log("El Banquero "+nombre+" con el id "+id+" creo la sala con el codigo: "+codigoSala);

            io.to(codigoSala).emit('quitarHeader',link);
            io.to(codigoSala).emit('cargarLink',link);
            io.to(codigoSala).emit('codigoDeSala',{codigo:codigoSala});
        } else {
            socket.emit('error', 'No se pudo crear la sala');
        }
   
  
    })

    socket.on('unirse', (datos)=>{
    console.log(datos)
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

    socket.on('expulsar', (jugador,socketId,codigoSala)=>{
        if (socketId) {
            io.to(codigoSala).emit('expulsado',jugador); // Notificar al jugador que ha sido expulsado (opcional)
            io.sockets.sockets.get(socketId).disconnect(); // Desconectar al jugador del socket
            console.log(`Jugador ${jugador} expulsado`);
        }
    })

    socket.on('jugar', (jugadoresJSON)=>{
        jugadoresJSON.forEach(jugadorData => {
            const jugador = new Jugador(
                jugadorData.id,
                jugadorData.nombre,
                jugadorData.host,
                jugadorData.color,
            );
            
            // Almacenar cada objeto Jugador en la lista
            jugadores.push(jugador);
        });
        
        console.log(jugadores);  // Verificar que la lista de objetos se ha creado

    })
}

