class Jugador {
    constructor() {
      this.id = "";
      this.nombre = "";
      this.host = null;
      this.color = ""
      this.dinero = 0;
    }

     cargar(id,nombre, host, color, dinero) {
      this.id = id;
      this.nombre = nombre;
      this.host = host
      this.color = color
      this.dinero = dinero;
    }
  
    cargarPorNombre(nombre) {
      return new Promise((resolve, reject) => {
          
      });
  }

    restarDinero(dinero){
      this.dinero -= dinero;
    }

    sumarDinero(dinero){
      this.dinero += dinero;
      
    }
  
    // Otros métodos y propiedades que necesites
  }
  
  module.exports = Jugador;
  