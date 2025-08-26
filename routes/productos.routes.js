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
  const { cantidad, stock } = req.body || {};
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Soporta dos modos:
  // - cantidad: delta a aplicar (puede ser negativo para rebajar stock)
  // - stock: valor absoluto a establecer (no negativo)
  if (typeof cantidad === 'number' && Number.isFinite(cantidad)) {
    const delta = Math.trunc(cantidad);
    const next = producto.stock + delta;
    producto.stock = Math.max(0, next);
    guardarProductos();
    return res.json(producto);
  }

  if (typeof stock === 'number' && stock >= 0) {
    producto.stock = Math.trunc(stock);
    guardarProductos();
    return res.json(producto);
  }

  return res.status(400).json({ error: "Debe enviar 'cantidad' (delta) o 'stock' válido" });
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

// Checkout en bloque: descuenta stock de múltiples ítems de forma atómica
router.post('/checkout', express.json(), (req, res) => {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Debe enviar items a procesar' });
  }

  // Normaliza y valida entradas
  const normalized = [];
  for (const raw of items) {
    const id = Number(raw?.id);
    const cantidad = Math.max(0, Math.trunc(Number(raw?.cantidad)));
    if (!Number.isFinite(id) || id <= 0 || !Number.isFinite(cantidad) || cantidad <= 0) {
      return res.status(400).json({ error: 'Items inválidos. Se espera id>0 y cantidad>0' });
    }
    normalized.push({ id, cantidad });
  }

  // Verifica existencia y stock suficiente
  for (const { id, cantidad } of normalized) {
    const producto = productos.find(p => p.id === id);
    if (!producto) {
      return res.status(404).json({ error: `Producto ${id} no encontrado` });
    }
    if (producto.stock < cantidad) {
      return res.status(409).json({ error: `Stock insuficiente para producto ${id}`, disponible: producto.stock, solicitado: cantidad });
    }
  }

  // Aplica descuentos (todo o nada)
  for (const { id, cantidad } of normalized) {
    const producto = productos.find(p => p.id === id);
    producto.stock = Math.max(0, producto.stock - cantidad);
  }
  guardarProductos();

  const actualizados = normalized.map(({ id }) => {
    const p = productos.find(x => x.id === id);
    return { id: p.id, stock: p.stock };
  });
  res.json({ mensaje: 'Compra finalizada', actualizados });
});

module.exports = router;