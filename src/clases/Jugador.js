const db = require('../database');

class Jugador {
  constructor() {
    this.id = "";
    this.nombre = "";
    this.host = null;
    this.color = ""
    this.dinero = 0;
  }

  cargar(id, nombre, host, color, dinero) {
    this.id = id;
    this.nombre = nombre;
    this.host = host
    this.color = color
    this.dinero = dinero;
  }

  // Método async para cargar el jugador por nombre
  async cargarPorNombre(nombre) {
    return new Promise((resolve, reject) => {
      db.find({ nombre: nombre }, (err, docs) => {
        if (err) {
          console.log('Error al consultar:', err);
          reject(err);  // Rechaza la promesa si hay error
        } else if (docs.length > 0) {
          const doc = docs[0];
          this.cargar(doc.id, doc.nombre, doc.host, doc.color, doc.dinero);
          resolve(true); // Resuelve la promesa con el jugador cargado
        } else {
          console.log('No se encontró ningún documento con ese nombre.');
          reject('No se encontró ningún jugador');
        }
      });
    });
  }

  guardarJugador() {
    return new Promise((resolve, reject) => {
      db.insert({ id: this.id, nombre: this.nombre, host: this.host, color: this.color, dinero: this.dinero }, (err, newDoc) => {
        if (err) {
          console.log('Error al insertar:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }


  async restarDinero(dinero) {
    this.dinero = this.dinero - dinero;
    return new Promise((resolve, reject) => {
      db.update({ id: this.id }, { $set: { dinero: this.dinero } }, {}, (err, numUpdated) => {
        if (err) {
          console.log('Error al actualizar dinero:', err);
          reject(err);
        } else {
          console.log('Dinero actual de ' + this.nombre + ': $', this.dinero);
          resolve(true);
        }
      });
    });
  }

  async sumarDinero(dinero) {
    this.dinero = this.dinero + dinero;
    return new Promise((resolve, reject) => {
      db.update({ id: this.id }, { $set: { dinero: this.dinero } }, {}, (err, numUpdated) => {
        if (err) {
          console.log('Error al actualizar dinero:', err);
          reject(err);
        } else {
          console.log('Dinero actual de ' + this.nombre + ': $', this.dinero);
          resolve(true);
        }
      });
    });
  }



}



module.exports = Jugador;
