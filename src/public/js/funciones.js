var socket = io();  // Inicializar la conexión con el servidor

function createRoom(){
    socket.emit('crear',{
        id: socket.id,
        nombre: prompt("Ingrese su nombre de jugador:"),
        bancoJugador: confirm("Quieres ser jugador tambien?")
    }
)};

function joinRoom(){
    socket.emit('unirse',socket.id+" quiere unirse");
};









socket.on('quitarHeader', (a)=>{
    const header = document.getElementById("header")
    header.style.display = none;
})

//console.log de error
socket.on('error', (msg) => {
    console.log("Error:"+msg);
});