// db.js
const sqlite3 = require('sqlite3').verbose();

// Crear o abrir la base de datos
const db = new sqlite3.Database('./jugadores.db');

// Crear la tabla de jugadores si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS jugadores (
          id TEXT PRIMARY KEY ,
          nombre TEXT NOT NULL,
          host BOOL NOT NULL,
          color TEXT NOT NULL,
          dinero INTEGER NOT NULL
        )
      `);
});

// Función para guardar un jugador
const guardarJugador = (id, nombre, host, color, dinero) => {
  const query = `INSERT INTO jugadores (id, nombre, host, color, dinero) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [id, nombre, host, color, dinero], function(err) {
    if (err) {
      return console.error('Error al guardar el jugador:', err.message);
    }
    console.log(`Jugador ${nombre} guardado con id ${this.lastID}`);
  });
};

// Función para cargar un jugador por su nombre
const cargarJugadorPorNombre = (nombre, callback) => {
  const query = `SELECT * FROM jugadores WHERE nombre = ?`;
  db.get(query, [nombre], (err, row) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, row);
  });
};

// funcion para retornal objeto jugador
const jugadorObjeto = (row) => {
  return {
    id: row.id,
    nombre: row.nombre,
    host: row.host,
    color: row.color,
    dinero: row.dinero
  };
};

const actualizarDineroPorNombre = (nombre ,dinero) => {
    const query = `UPDATE jugadores SET dinero =? WHERE nombre =?`;
    db.run(query, [dinero, nombre], function(err) {
      if (err) {
        return console.error('Error al actualizar el dinero:', err.message);
      }
      console.log(`Dinero actualizado para el jugador ${nombre} a $${dinero}`);
    });
}

function vaciarTablas(callback) {
  const tablas = ['jugadores']; // Asegúrate de incluir todas las tablas que deseas vaciar
  let tablasVaciadas = 0;

  tablas.forEach(tabla => {
      db.run(`DELETE FROM ${tabla}`, (err) => {  // También podrías usar 'TRUNCATE' en otros motores SQL, pero en SQLite es mejor usar 'DELETE'
          if (err) {
              console.error(`Error al vaciar la tabla ${tabla}:`, err);
              if (callback) callback(err);
              return;
          }
          console.log(`Tabla ${tabla} vaciada exitosamente.`);
          tablasVaciadas++;

          // Si hemos vaciado todas las tablas, ejecutamos el callback
          if (tablasVaciadas === tablas.length) {
              if (callback) callback(null);
          }
      });
  });
}

function verTodoDeTablas() {
  const tablas = ['jugadores']; // Lista de tablas que quieres ver
  tablas.forEach(tabla => {
      db.all(`SELECT * FROM ${tabla}`, (err, rows) => {
          if (err) {
              console.error(`Error al obtener datos de la tabla ${tabla}:`, err);
              return;
          }
          console.log(`Datos de la tabla ${tabla}:`, rows);
      });
  });
}

// Exportar las funciones
module.exports = {
  guardarJugador,
  cargarJugadorPorNombre,
  jugadorObjeto,
  actualizarDineroPorNombre,
  vaciarTablas,
  verTodoDeTablas
};
