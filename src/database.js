const Datastore = require('nedb'); // Importar NeDB

// Crear una base de datos en un archivo (si no existe, lo creará)
const db = new Datastore({ filename: 'mydb.db', autoload: true });

// Verificar si la base de datos se cargó correctamente
db.loadDatabase((err) => {
  if (err) {
    console.log('Error al cargar la base de datos:', err);
  } else {
    console.log('Base de datos cargada correctamente');
  }
});

module.exports = db;  // Exportar la base de datos para usarla en otros archivos