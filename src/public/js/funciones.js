var socket = io();  // Inicializar la conexión con el servidor

function createRoom(){
    socket.emit('crear',{
        id: socket.id,
        nombre: prompt("Ingrese su nombre de jugador:"),
        bancoJugador: confirm("Quieres ser jugador tambien?")
    }
)};

function joinRoom(){
    const header = document.getElementById("header")
    const codigo = document.getElementById("codigo");
    header.style.display = "none";
    codigo.style.display = "flex";
};

function unirse(){
    const codigo = document.getElementById("codigo");
    const espera = document.getElementById("espera");
    const codigoSala = document.getElementById("codigoSala").value;
    const nombre = document.getElementById("nombre").value;
    codigo.style.display = "none";
    espera.style.display = "flex";
    socket.emit('unirse', {
        codigoSala: codigoSala,
        nombre: nombre
    });
}

socket.on('comprobarJugadores', (a)=>{
console.log("estoy dentro");
})









socket.on('quitarHeader', (a)=>{
    const header = document.getElementById("header")
    const espera = document.getElementById("espera")
    header.style.display = "none";
    espera.style.display = "flex";
})

socket.on('codigoDeSala', (codigo)=>{
    const header = document.getElementById("header")
    const espera = document.getElementById("espera")
    header.style.display = "none";
    espera.style.display = "flex";
    espera.innerHTML = codigo.codigo
    
})

socket.on('espera', (a)=>{
    const header = document.getElementById("header")
    header.style.display = "none";
})


//console.log de error
socket.on('error', (msg) => {
    console.log("Error:"+msg);
});