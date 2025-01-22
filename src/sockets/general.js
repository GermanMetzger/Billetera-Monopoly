const os = require('os');
const Jugador = require('../clases/Jugador'); // Importa la clase
let salas = {}; // Objeto para almacenar jugadores por cada sala
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
            const color = "#FFFFFF"
            console.log("El Banquero "+nombre+" con el id "+id+" creo la sala con el codigo: "+codigoSala);

            salas[codigoSala] = [];

                // Agregar el jugador al arreglo de la sala
            const jugador = new Jugador(socket.id, nombre, true, color);
            salas[codigoSala].push(jugador);

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
    const color = datos.color;
    socket.join(codigoSala);
    console.log("El jugador "+nombre+" con el id "+socket.id+" se une a la sala con el codigo: "+codigoSala);

    // Agregar el jugador al arreglo de la sala
    const jugador = new Jugador(socket.id, nombre, false, color);
    salas[codigoSala].push(jugador);

    io.to(codigoSala).emit('comprobarJugadores',datos);

    })

    socket.on('compartir', (jugadores)=>{
        jugadores.forEach(jugador=>{
            codigoSala = jugador.codigoSala;
        })
        io.to(codigoSala).emit('actualizarJugadores', jugadores);
    
    })

    socket.on('expulsar', (nombre, socketId, codigoSala) => {
        if (socketId) {
            salas[codigoSala] = salas[codigoSala].filter(jugador => jugador.nombre !== nombre);

            // Emitir el evento para expulsar y desconectar
            io.to(codigoSala).emit('expulsado', nombre);
            io.sockets.sockets.get(socketId).disconnect(); 
            console.log(`Jugador ${nombre} expulsado`);
            console.log(salas[codigoSala])
        }
    });
    

    socket.on('jugar', (jugadoresJSON) => {
        const codigoSala = jugadoresJSON[1].codigoSala;
        
        // Usar el arreglo de jugadores de esa sala
        const salaJugadores = salas[codigoSala] || []; // Si no existe, asignamos un arreglo vacío
        console.log(salaJugadores);  // Verificar que la lista de objetos se ha creado correctamente
        
        salaJugadores.forEach(jugadorData => {
            // Verificar si el jugador ya está en la sala
            const jugadorExistente = salaJugadores.find(jugador => jugador.id === jugadorData.id);
            
            if (!jugadorExistente) {
                const jugador = new Jugador(
                    jugadorData.id,
                    jugadorData.nombre,
                    jugadorData.host,
                    jugadorData.color
                );
                
                // Si no existe, agregarlo a la sala
                salaJugadores.push(jugador);
            }
        });
    

        io.to(codigoSala).emit('comenzarJuego', salaJugadores);
    });

    socket.on("regalar",(json) => {
        const regalador = json.regalador;
        const regalado = json.regalado;
        const dinero = json.dinero;
        console.log(regalador+" le va a regalar $"+dinero+" a "+regalado);
    })
    

    socket.on('disconnect', () => {
        for (let codigoSala in salas) {
            // Eliminar el jugador de la sala
            salas[codigoSala] = salas[codigoSala].filter(jugador => jugador.id !== socket.id);

            // Si la sala está vacía, eliminarla
            if (salas[codigoSala].length === 0) {
                delete salas[codigoSala];
                console.log(`La sala ${codigoSala} está vacía y ha sido eliminada.`);
            }
        }
    });
}

