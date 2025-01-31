const os = require('os');
const Jugador = require('../clases/Jugador'); // Importa la clase



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


let salas = {}; // Objeto para almacenar jugadores por cada sala
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
            console.log("El Banquero "+nombre+" con el id "+id+" creo la sala con el codigo: "+codigoSala);

            salas[codigoSala] = [];

            salas[codigoSala].push(creador);

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
        const dineroInicial = 1500;
        let salaJugadoresTmp = [];
        
        jugadoresJSON.forEach(jugadorData => {
                const jugador = new Jugador();
                //guardarObjeto
                jugador.cargar(jugadorData.id,jugadorData.nombre,jugadorData.host,jugadorData.color,dineroInicial)
                jugador.guardarJugador()
                // Añadir el jugador a la lista de jugadores de la sala
                salaJugadoresTmp.push(jugador);
            
        });
        salas[codigoSala] = salaJugadoresTmp;
    
    
        // Emitir la lista de jugadores actualizada para comenzar el juego
        io.to(codigoSala).emit('comenzarJuego', salas[codigoSala]);
    });
    

    socket.on("regalar", async (json) => {
        const regalador = json.regalador;
        const regalado = json.regalado;
        const dinero = Number(json.dinero);
        try {
            // Obtengo a los jugadores usando promesas
            const emisor = new Jugador();
            const receptor = new Jugador();

            if (!(await emisor.cargarPorNombre(regalador)) || !(await receptor.cargarPorNombre(regalado))) {
                console.log('Uno o ambos jugadores no fueron encontrados');
                return;
              }
    
            // Restamos y sumamos dinero
            if(await emisor.restarDinero(dinero)){
                console.log("Regalo enviado")
            }
            if(await receptor.sumarDinero(dinero)){
                console.log("Regalo enviado")
            }
    
            // Ahora creamos el objeto datos con los valores actualizados
            const datos = {
                emisor: regalador,
                receptor: regalado,
                emisorDinero: emisor.dinero,  // Valor actualizado
                receptorDinero: receptor.dinero  // Valor actualizado
            };
    
            // Enviar los datos actualizados
            io.to(json.codigoSala).emit('actualizarDinero',datos );    
        } catch (error) {
            console.error('Error al procesar la operación:', error);
        }

    })

    socket.on("darAlBanco", async (json)=>{
        const jugador = new Jugador();
        const dinero = Number(json.dinero);
        console.log(json);
        try{
            await jugador.cargarPorNombre(json.nombre);
            if(await jugador.restarDinero(dinero)){
                console.log(jugador.nombre+" le a pagado $"+dinero+" al banco.")
            }

        }catch{
            console.log("hubo un error del lado de la base de datos");
        };
        const jSon ={
            nombre: json.nombre,
            dinero: jugador.dinero
        }

        io.to(json.codigoSala).emit("mostrarDineroActual",jSon)


    });
    

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

