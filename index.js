const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Configuración de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'infotech',
  password: 'infotech',
  database: 'agenda_node'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos');
  }
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar el envío del formulario
app.post('/guardar', (req, res) => {
  const { nombre, apellido, direccion, telefono, email } = req.body;
  const query = 'INSERT INTO clientes (nombre, apellido, direccion, telefono, email) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, apellido, direccion, telefono, email], (err, results) => {
    if (err) {
      console.error('Error al agregar usuario:', err);
      res.status(500).send('Error al agregar usuario');
    } else {
      //res.send('Usuario agregado exitosamente');
      res.redirect('clientes.html');
    }
  });
});

//eliminar
app.get('/eliminar', (req, res) => {
    const id = req.query.id;
    const query = 'DELETE FROM clientes WHERE ID ='+id;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al eliminar cliente:', err);
        res.status(500).send('Error al eliminar cliente:');
      } else {
        res.redirect('clientes.html');
      }
    });
  });


//editar
app.get('/editar', (req, res) => {
    const id_edit = req.query.id;
    const query = 'SELECT * FROM clientes WHERE ID ='+id_edit;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al traer valores:', err);
        res.status(500).send('Error al editar cliente:');
      } else {
        res.json(results);
      }
    });
  });  
  

// Obtener todos los usuarios
app.get('/clientes', (req, res) => {
    const query = 'SELECT * FROM clientes';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).send('Error al obtener usuarios');
      } else {
        res.json(results);
      }
    });
  });


  //Actualizar
  app.put('/actualizar', (req, res) => {
    const { id, nombre, apellido, direccion, telefono, email } = req.body;
  
    const query = 'UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, email = ? WHERE id = ?';
    db.query(query, [nombre, apellido, direccion, telefono, email, id], (err, results) => {
      if (err) {
        console.error('Error al actualizar cliente:', err);
        res.status(500).send('Error al actualizar cliente');
      } else {
        res.redirect("clientes.html");
      }
    });
  });
  

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
