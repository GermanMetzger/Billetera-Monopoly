var socket = io();  // Inicializar la conexión con el servidor

function createRoom(){
    nombre = prompt("Ingrese su nombre de jugador:");
    let jugadores = [];

    json = {
        id: socket.id,
        nombre: nombre,
        host: true,
    }

    jugadores.push(json); // Insert
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores)); // Save
    sessionStorage.setItem('host', true);
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
    const color = document.getElementById("color").value;
    codigo.style.display = "none";
    let jugadores = [];
    json = {
        codigoSala: codigoSala,
        id: socket.id,
        nombre: nombre,
        host: false,
        color: color
    }
    jugadores.push(json); // Insert
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores)); // Save
    sessionStorage.setItem('host', false);
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

//socket que se encarga de mostrar al resto de jugadores cuando un nuevo jugador se une a la sala
socket.on('actualizarJugadores', (jugadores)=>{
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores));
    const codigoSala = jugadores.codigoSala;
    let host = sessionStorage.getItem('host') === 'true';
    const espera = document.getElementById("espera")
    espera.style.display = "flex";
    espera.innerHTML = "";
    jugadores.forEach(jugador=>{
        if(!host){
            const jugadorDiv = document.createElement("div");
            jugadorDiv.setAttribute("id",jugador.nombre);
            jugadorDiv.style.borderColor = jugador.color;
            jugadorDiv.style.color = jugador.color;
            jugadorDiv.classList.add("jugador");
            jugadorDiv.innerText = jugador.nombre;
            espera.appendChild(jugadorDiv);
        }else{
            const jugadorDiv = document.createElement("div");
            jugadorDiv.setAttribute("id",jugador.nombre);
            jugadorDiv.style.borderColor = jugador.color;
            jugadorDiv.style.color = jugador.color;
            jugadorDiv.classList.add("jugador");
            jugadorDiv.innerText = jugador.nombre+" "+" "+" "+"(Expulsar)";
            jugadorDiv.style.cursor = "pointer";

            jugadorDiv.onclick = function() {
                socket.emit('expulsar', jugador.nombre,jugador.id,jugadores[1].codigoSala);
            };

            espera.appendChild(jugadorDiv);
        }
    })
});

socket.on('expulsado', (jugador)=>{
    console.log("Expulsando al jugador:", jugador);
    alert("expulsado");

    const jugadorDiv = document.getElementById(jugador);
    if (jugadorDiv) {
        jugadorDiv.remove(); // Eliminar el div del jugador de la lista
    }
});

//socket que se encarga de ocultar el menu principal
socket.on('quitarHeader', (a)=>{
    const header = document.getElementById("header");
    const espera = document.getElementById("espera");
    const centrarTodo = document.getElementById("centrarTodo");
    centrarTodo.style.display = "flex";
    header.style.display = "none";
    espera.style.display = "flex";
})

//socket que toma del servidor el codigo de la sala y lo muestra al host
socket.on('codigoDeSala', (codigo)=>{
    const header = document.getElementById("header")
    const clave = document.getElementById("clave")
    header.style.display = "none";
    clave.style.display = "flex";
    clave.innerHTML = codigo.codigo
})

//socket que busca el link en el servidor y lo muestra en pantalla
socket.on("cargarLink", (link)=>{
    const linkDiv = document.getElementById("linkDiv")
    const comenzar = document.getElementById("comenzar")
    comenzar.style.display = "flex";
    linkDiv.innerHTML = link;
})

//funcionamiento de boton para copiar link en pc y movil
function copiarLink() {
    const link = document.getElementById("linkDiv").innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        // Si la API de clipboard está disponible
        navigator.clipboard.writeText(link).then(() => {
            alert("Enlace copiado al portapapeles!");
        }).catch(err => {
            alert("Error al copiar: " + err);
        });
    } else {
        // Método alternativo para dispositivos que no soporten navigator.clipboard
        const textarea = document.createElement("textarea");
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert("Enlace copiado al portapapeles!");
        } catch (err) {
            alert("Error al copiar: " + err);
        }
        document.body.removeChild(textarea);
    }
}

//listener que hace que no se pueda actualizar la pagina en movil
document.addEventListener('touchmove', function(event) {
    if (window.scrollY === 0 && event.touches[0].clientY > 0) {
        event.preventDefault();  // Evita el desplazamiento hacia abajo
    }
}, { passive: false });

//socket que oculta el menu
socket.on('espera', (a)=>{
    const header = document.getElementById("header")
    header.style.display = "none";
})

//console.log de error
socket.on('error', (msg) => {
    console.log("Error:"+msg);
});

//socket que toma a todos los jugadores y comienza el juego
function jugar(){
    let jugadores = JSON.parse(sessionStorage.getItem('jugadores')); //todos los jugadores

}

//boton de comenzar que se muestra solo al host
socket.on("comenzar",()=>{
    const comenzar = document.getElementById("comenzar");
    comenzar.style.display = "flex";
})

//
function jugar(){
    let jugadores = JSON.parse(sessionStorage.getItem('jugadores'));
    socket.emit("jugar",jugadores);
}