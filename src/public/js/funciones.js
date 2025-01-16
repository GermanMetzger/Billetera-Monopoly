var socket = io();  // Inicializar la conexión con el servidor

function createRoom(){
    nombre = prompt("Ingrese su nombre de jugador:");
    let jugadores = [];

    json = {
        id: socket.id,
        nombre: nombre,
        host: true
    }

    jugadores.push(json); // Insert
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores)); // Save
    socket.emit('crear',json)
};



function joinRoom(){
    const header = document.getElementById("header")
    const codigo = document.getElementById("codigo");
    header.style.display = "none";
    codigo.style.display = "flex";
};



function unirse(){
    const codigo = document.getElementById("codigo");
    const codigoSala = document.getElementById("codigoSala").value;
    const nombre = document.getElementById("nombre").value;
    codigo.style.display = "none";
    let jugadores = [];
    json = {
        codigoSala: codigoSala,
        id: socket.id,
        nombre: nombre,
        host: false
    }
    jugadores.push(json); // Insert
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores)); // Save
    socket.emit('unirse',json);
}

socket.on('comprobarJugadores', (a)=>{
    let jugadores = JSON.parse(sessionStorage.getItem('jugadores'));
    jugadores.forEach(jugador => {
        if (jugador.host){
            jugadores.push(a);
            sessionStorage.setItem('jugadores', JSON.stringify(jugadores));
            socket.emit("compartir",jugadores);
        }
    });
})

socket.on('actualizarJugadores', (jugadores)=>{
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores));
    const espera = document.getElementById("espera")
    espera.innerHTML = "";
    jugadores.forEach(jugador=>{
        const jugadorDiv = document.createElement("div");
        jugadorDiv.classList.add("jugador");
        jugadorDiv.innerText = jugador.nombre;
        espera.appendChild(jugadorDiv);
    })
});

socket.on('jugadorSeFue', (jugadorSalido)=>{
    let jugadores = JSON.parse(sessionStorage.getItem('jugadores'));
    jugadores.forEach(jugador => {
        if (jugador.host){

        }
    });
});



socket.on('quitarHeader', (a)=>{
    const header = document.getElementById("header");
    const espera = document.getElementById("espera");
    const centrarTodo = document.getElementById("centrarTodo");
    centrarTodo.style.display = "flex";
    header.style.display = "none";
    espera.style.display = "flex";
})

socket.on("comenzar",()=>{
    const comenzar = document.getElementById("comenzar");
    comenzar.style.display = "flex";
})

socket.on('codigoDeSala', (codigo)=>{
    const header = document.getElementById("header")
    const clave = document.getElementById("clave")
    header.style.display = "none";
    clave.style.display = "flex";
    clave.innerHTML = codigo.codigo
})

socket.on("cargarLink", (link)=>{
    const linkDiv = document.getElementById("linkDiv")
    linkDiv.innerHTML = link;
})

function copiarLink(){
    const link = document.getElementById("linkDiv").innerText;
    
    // Usamos navigator.clipboard.writeText() para copiar al portapapeles
    navigator.clipboard.writeText(link).then(() => {
        alert("Enlace copiado al portapapeles!");
    }).catch(err => {
        alert("Error al copiar: " + err);
    });
}

socket.on('espera', (a)=>{
    const header = document.getElementById("header")
    header.style.display = "none";
})


//console.log de error
socket.on('error', (msg) => {
    console.log("Error:"+msg);
});

function jugar(){
    let jugadores = JSON.parse(sessionStorage.getItem('jugadores')); //todos los jugadores

}