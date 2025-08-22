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

