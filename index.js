const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

const API_TOKEN = '0c599596942953e4fd026124008f7b72';
const API_BASE_URL = `https://superheroapi.com/api/${API_TOKEN}`;

let productos = [];
try {
  const data = fs.readFileSync('productos.json', 'utf8');
  productos = JSON.parse(data);
} catch (err) {
  console.error('Error al leer productos.json:', err.message);
}


app.use(cors());

app.get('/api/superheroe/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const response = await axios.get(`${API_BASE_URL}/search/${name}`);
    res.json(response.data);
  } catch (err) {
    console.error('Error al consultar la API:', err.message);
    res.status(500).json({ error: 'Error al consultar SuperHero API' });
  }
});
app.get('/api/superhero/:id', async (req, res) => {
  const id = req.params.id;
  try {
    console.log(`${API_BASE_URL}/${id}`);
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    
    res.json(response.data);
  } catch (err) {
    console.error('Error al consultar la API:', err.message);
    res.status(500).json({ error: 'Error al consultar SuperHero API' });
  }
});

app.get('/api/productos', (req, res) => {
  res.json(productos);
});

app.get('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy activo en http://localhost:${PORT}`);
});