const { cargarJugadorPorNombre, actualizarDineroPorNombre } = require('../db.js');

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
          cargarJugadorPorNombre(nombre, (err, row) => {
              if (err) {
                  return reject(err);
              }
    
              if (row) {
                  this.cargar(row.id, row.nombre, row.host, row.color, row.dinero);
                  resolve(this); // Resolvemos la promesa con la instancia actual
              } else {
                  resolve(null); // Jugador no encontrado
              }
          });
      });
  }

    restarDinero(dinero){
      this.dinero -= dinero;
      actualizarDineroPorNombre(this.nombre, this.dinero)
    }

    sumarDinero(dinero){
      this.dinero += dinero;
      actualizarDineroPorNombre(this.nombre, this.dinero)
    }
  
    // Otros métodos y propiedades que necesites
  }
  
  module.exports = Jugador;
  