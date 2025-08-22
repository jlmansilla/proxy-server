const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
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


const guardarProductos = () => {
  fs.writeFile('productos.json', JSON.stringify(productos, null, 2),'utf8');
};

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

app.post('/api/productos', express.json(), (req, res) => {
  const { nombre, precio, descripcion, imagen, stock } = req.body;
  if (!nombre || !precio || !descripcion || !imagen || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'Faltan campos obligatorios o stock inválido' });
  }
  const nuevoProducto = {
    id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio,
    descripcion: descripcion || '',
    imagen: imagen || '',
    stock: stock ?? 0
  };
  productos.push(nuevoProducto);
  guardarProductos();
  res.status(201).json(nuevoProducto);
});

api.put('/api/productos/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  
  const { nombre, precio, descripcion, imagen, stock } = req.body;  
  
  producto.nombre = nombre ?? producto.nombre;
  producto.precio = precio ?? producto.precio;
  producto.descripcion = descripcion ?? producto.descripcion;
  producto.imagen = imagen ?? producto.imagen;

  if (typeof stock === 'number' && stock >= 0) {
    producto.stock = stock;
  }

  guardarProductos();
  res.json(producto);

});

api.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  
  if (index !== -1) {
    productos.splice(index, 1);
    guardarProductos();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.patch('/api/productos/:id/stock', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const { stock } = req.body;
  const producto = productos.find(p => p.id === id);
  
  if (producto) {
    if (typeof stock === 'number' && stock >= 0) {
      producto.stock = stock;
      guardarProductos();
      res.json(producto);
    } else {
      res.status(400).json({ error: 'Stock debe ser un número no negativo' });
    }
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.put('/api/productos/:id/stock/reset', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const { nuevoStock } = req.body;

  const producto = productos.find(p => p.id === id);
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  if (typeof nuevoStock !== 'number' || nuevoStock < 0) {
    return res.status(400).json({ error: 'Debe enviar un valor numérico válido' });
  }

  producto.stock = nuevoStock;
  guardarProductos();
  res.json({ mensaje: 'Stock actualizado', producto });
});

app.post('/api/enviar-correo', express.json(), (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  console.log(`📧 Simulando envío de correo:
    De: ${nombre} <${email}>
    Asunto: ${asunto}
    Mensaje: ${mensaje}
  `);

  res.json({ mensaje: "Correo simulado correctamente." });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => {
  console.log(`Proxy activo en http://localhost:${PORT}`);
});