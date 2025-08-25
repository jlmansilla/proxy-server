const express = require('express');
const fs = require('fs');
const router = express.Router();

const rutaProductos = './productos.json';

let productos = [];
try {
  const data = fs.readFileSync(rutaProductos, 'utf8');
  productos = JSON.parse(data);
} catch (err) {
  productos = [];
}

const guardarProductos = () => {
  fs.writeFileSync(rutaProductos, JSON.stringify(productos, null, 2), 'utf8');
};

// === CRUD ===

router.get('/', (req, res) => {
  res.json(productos);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

router.post('/', express.json(), (req, res) => {
  const { nombre, precio, descripcion, imagen, stock, etiquetas } = req.body;
  if (!nombre || !precio) return res.status(400).json({ error: 'Nombre y precio son obligatorios' });

  if (etiquetas !== undefined && !Array.isArray(etiquetas)) {
    return res.status(400).json({ error: 'El campo etiquetas debe ser un arreglo' });
  }

  const nuevo = {
    id: productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1,
    nombre, precio,
    descripcion: descripcion || '',
    imagen: imagen || '',
    stock: stock ?? 0,
    etiquetas: Array.isArray(etiquetas) ? etiquetas.filter(e => typeof e === 'string') : []
  };

  productos.push(nuevo);
  guardarProductos();
  res.status(201).json(nuevo);
});

router.put('/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const { nombre, precio, descripcion, imagen, stock, etiquetas } = req.body;
  if (etiquetas !== undefined && !Array.isArray(etiquetas)) {
    return res.status(400).json({ error: 'El campo etiquetas debe ser un arreglo' });
  }
  producto.nombre = nombre ?? producto.nombre;
  producto.precio = precio ?? producto.precio;
  producto.descripcion = descripcion ?? producto.descripcion;
  producto.imagen = imagen ?? producto.imagen;
  producto.stock = stock ?? producto.stock;
  if (etiquetas !== undefined) {
    producto.etiquetas = etiquetas.filter(e => typeof e === 'string');
  }

  guardarProductos();
  res.json(producto);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  const eliminado = productos.splice(index, 1)[0];
  guardarProductos();
  res.json({ mensaje: 'Producto eliminado', producto: eliminado });
});

router.patch("/:id/stock", express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const { stock } = req.body;
  const producto = productos.find((p) => p.id === id);

  if (producto) {
    if (typeof stock === "number" && stock >= 0) {
      producto.stock = stock;
      guardarProductos();
      res.json(producto);
    } else {
      res.status(400).json({ error: "Stock debe ser un número no negativo" });
    }
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.put("/:id/stock/reset", express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const { nuevoStock } = req.body;

  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  if (typeof nuevoStock !== "number" || nuevoStock < 0) {
    return res
      .status(400)
      .json({ error: "Debe enviar un valor numérico válido" });
  }

  producto.stock = nuevoStock;
  guardarProductos();
  res.json({ mensaje: "Stock actualizado", producto });
});

module.exports = router;