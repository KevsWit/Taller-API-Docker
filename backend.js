const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuración de bodyParser para procesar solicitudes JSON
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de conexión a PostgreSQL
const client = new Client({
  user: 'postgres',
  host: '172.18.0.2', // Reemplaza con la IP de tu contenedor de PostgreSQL
  database: 'bbdd',
  password: '1234',
  port: 5432,
});

client.connect();

// Endpoint para obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM tarea');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Endpoint para agregar una nueva tarea
app.post('/tasks', async (req, res) => {
  const { nombre, estado } = req.body;
  try {
    const result = await client.query('INSERT INTO tarea (nombre, estado) VALUES ($1, $2) RETURNING *', [nombre, estado]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar tarea' });
  }
});

// Endpoint para actualizar una tarea
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { nombre, estado } = req.body;
  try {
    const result = await client.query('UPDATE tarea SET nombre = $1, estado = $2 WHERE id = $3 RETURNING *', [nombre, estado, taskId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// Endpoint para eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await client.query('DELETE FROM tarea WHERE id = $1 RETURNING *', [taskId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
