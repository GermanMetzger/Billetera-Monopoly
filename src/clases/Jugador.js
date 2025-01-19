class Jugador {
    constructor(id, nombre,host,color) {
      this.id = id;
      this.nombre = nombre;
      this.host = host
      this.color = color
      this.dinero = 1500;
      this.propiedades = 0;
    }
  
    enviarMensaje(mensaje) {
      console.log(`Mensaje enviado por ${this.nombre}: ${mensaje}`);
    }
  
    // Otros métodos y propiedades que necesites
  }
  
  module.exports = Jugador;
  