var socket = io();  // Inicializar la conexión con el servidor

function createRoom() {
    nombre = prompt("Ingrese su nombre de jugador:");
    let jugadores = [];

    json = {
        id: socket.id,
        nombre: nombre,
        host: true,
        color: "#000000"
    }

    jugadores.push(json); // Insert
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores)); // Save
    sessionStorage.setItem('host', true);
    sessionStorage.setItem('yo', JSON.stringify(json)); // Save
    socket.emit('crear', json)
};



function joinRoom() {
    const header = document.getElementById("header")
    const codigo = document.getElementById("codigo");
    header.style.display = "none";
    codigo.style.display = "flex";
};



function unirse() {
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
    sessionStorage.setItem('yo', JSON.stringify(json)); // Save
    socket.emit('unirse', json);
}

socket.on('comprobarJugadores', (a) => {
    let jugadores = JSON.parse(sessionStorage.getItem('jugadores'));
    jugadores.forEach(jugador => {
        if (jugador.host) {
            jugadores.push(a);
            sessionStorage.setItem('jugadores', JSON.stringify(jugadores));
            socket.emit("compartir", jugadores);
        }
    });
})

//socket que se encarga de mostrar al resto de jugadores cuando un nuevo jugador se une a la sala
socket.on('actualizarJugadores', (jugadores) => {
    sessionStorage.setItem('jugadores', JSON.stringify(jugadores));
    const codigoSala = jugadores.codigoSala;
    let host = sessionStorage.getItem('host') === 'true';
    const espera = document.getElementById("espera")
    espera.style.display = "flex";
    espera.innerHTML = "";
    jugadores.forEach(jugador => {
        if (!host) {
            const jugadorDiv = document.createElement("div");
            jugadorDiv.setAttribute("id", jugador.nombre);
            jugadorDiv.style.borderColor = jugador.color;
            jugadorDiv.style.color = jugador.color;
            jugadorDiv.classList.add("jugador");
            jugadorDiv.innerText = jugador.nombre;
            espera.appendChild(jugadorDiv);
        } else {
            const jugadorDiv = document.createElement("div");
            jugadorDiv.setAttribute("id", jugador.nombre);
            jugadorDiv.style.borderColor = jugador.color;
            jugadorDiv.style.color = jugador.color;
            jugadorDiv.classList.add("jugador");
            jugadorDiv.innerText = jugador.nombre + "(Expulsar)";
            jugadorDiv.style.cursor = "pointer";

            jugadorDiv.onclick = function () {
                socket.emit('expulsar', jugador.nombre, jugador.id, jugadores[1].codigoSala);
            };

            espera.appendChild(jugadorDiv);
        }
    })
});

socket.on('expulsado', (jugador) => {
    console.log("Expulsando al jugador:", jugador);

    const jugadorDiv = document.getElementById(jugador);
    if (jugadorDiv) {
        jugadorDiv.remove(); // Eliminar el div del jugador de la lista
    }
});

//socket que se encarga de ocultar el menu principal
socket.on('quitarHeader', (a) => {
    const header = document.getElementById("header");
    const espera = document.getElementById("espera");
    const centrarTodo = document.getElementById("centrarTodo");
    centrarTodo.style.display = "flex";
    header.style.display = "none";
    espera.style.display = "flex";
})

//socket que toma del servidor el codigo de la sala y lo muestra al host
socket.on('codigoDeSala', (codigo) => {
    const header = document.getElementById("header")
    const clave = document.getElementById("clave")
    header.style.display = "none";
    clave.style.display = "flex";
    clave.innerHTML = codigo.codigo
})

//socket que busca el link en el servidor y lo muestra en pantalla
socket.on("cargarLink", (link) => {
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
document.addEventListener('touchmove', function (event) {
    if (window.scrollY === 0 && event.touches[0].clientY > 0) {
        event.preventDefault();  // Evita el desplazamiento hacia abajo
    }
}, { passive: false });

//socket que oculta el menu
socket.on('espera', (a) => {
    const header = document.getElementById("header")
    header.style.display = "none";
})

//console.log de error
socket.on('error', (msg) => {
    console.log("Error:" + msg);
});


//boton de comenzar que se muestra solo al host
socket.on("comenzar", () => {
    const comenzar = document.getElementById("comenzar");
    comenzar.style.display = "flex";
})

//funcion que combierte los JSON en objetos dentro del servidor
function jugar() {
    let jugadores = JSON.parse(sessionStorage.getItem('jugadores'));
    socket.emit("jugar", jugadores);
}

//funcion para obtener los valores de colores rgb de hexadecimal
function hexToRgb(hex) {
    var bigint = parseInt(hex.slice(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}
//Aca se ocultan todas las ventanas y se generan las billeteras
socket.on("comenzarJuego", (jugadores) => {
    const container = document.getElementById("container");
    const billeteras = document.getElementById("billeteras");
    const acciones = document.getElementById("acciones");
    container.style.display = "none";
    acciones.style.display = "flex";
    billeteras.style.display = "flex";


    jugadores.forEach(jugador => {
        const divParaBilletera = document.createElement("div");
        const billetera = document.createElement("div");
        const dinero = document.createElement("div");
        const regalar = document.createElement("div");
        const yo = JSON.parse(sessionStorage.getItem('yo'));
        const codigoSala = document.getElementById("clave").innerText;


        billetera.setAttribute("id", jugador.nombre);
        divParaBilletera.setAttribute("class", "divParaBilletera");
        divParaBilletera.setAttribute("id", "divParaBilletera");
        dinero.setAttribute("id", jugador.nombre + "Dinero");
        dinero.setAttribute("class", "dinero");
        regalar.setAttribute("class", "accion");
        if(jugador.nombre == yo.nombre){
            regalar.style.display = "none";
        }
        regalar.addEventListener('click',function(){
            console.log(yo.nombre +" quiere regalarle a "+jugador.nombre);
            let numero;
            const div = document.getElementById(yo.nombre+"Dinero").innerText.slice(1);
            const dinero = Number(div);
            do {
                numero = prompt("Por favor, ingresa cuánto le vas a regalar a " + jugador.nombre + ":");
            } while (numero !== null && (isNaN(numero) || numero === '' || Number(numero) <= 0 || Number(numero) > dinero));
            if (numero !== null) {
                numero = Number(numero);
                let json = {
                    regalador: yo.nombre,
                    regalado: jugador.nombre,
                    dinero: numero,
                    codigoSala: codigoSala
                }
                socket.emit('regalar', json);
                console.log("Número ingresado:", numero);
            } else {
                console.log("Regalo cancelado");
            }
            
        });
        regalar.innerHTML = "Regalar";
        billetera.style.borderColor = jugador.color;
        billetera.style.backgroundColor = `rgba(${hexToRgb(jugador.color)}, 0.5)`;
        billetera.classList.add("jugador");
        billetera.innerText = jugador.nombre;
        dinero.innerText = "$" + jugador.dinero;

        // Agregamos el div a la sección de billeteras
        billeteras.appendChild(divParaBilletera);
        divParaBilletera.appendChild(billetera);
        billetera.appendChild(dinero);
        billetera.appendChild(regalar);

        divParaBilletera.style.animationDirection = "alternate-reverse"; // Anima el borde del contenedor

    });





    let host = sessionStorage.getItem('host') === 'true';
    if (host) {
        const banco1 = document.getElementById("banco1");
        const banco2 = document.getElementById("banco2");
        banco1.style.display = "flex";
        banco2.style.display = "flex";
    }

})


//funciones dentro del juego!!!!!!!!!

socket.on("actualizarDinero",(json) => {
    console.log(json);
    const emisorDiv = document.getElementById(json.emisor+"Dinero");
    emisorDiv.innerHTML = json.emisorDinero;

    const receptorDiv = document.getElementById(json.receptor+"Dinero");
    receptorDiv.innerHTML = json.receptorDinero;
    


})



function pagar() {

}
function subastar() {

}
function pagarJugador() {

}
function cobrarJugador() {

}
