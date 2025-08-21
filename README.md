# 🦸‍♂️ Proxy API + Productos Locales con Node.js y Express

Este proyecto implementa un servidor en Node.js que:

- Expone un **proxy** a la [SuperHero API](https://superheroapi.com/)
- Expone un **endpoint de productos locales** desde un archivo `productos.json`
- Permite consultar todos los productos, buscar por ID y filtrar por nombre

## 🚀 Tecnologías usadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

## 📦 Instalación

```bash
git clone git@github.com:FaboTower/proxy-server.git
cd proxy-superhero
npm install
```

## Uso
```bash
node index.js
```

El servidor correrá en:
http://localhost:3000

## 🔗 Endpoints disponibles
### 🌐 SuperHero API (proxy)
- GET /api/superheroe/:name
Busca superhéroes por nombre.

- GET /api/superhero/:id
Busca superhéroes por ID.

### 🛒 Productos (Archivo Local)
- GET api/productos
Lista todos los productos de la tienda.

- GET api/productos/:id
Consulta un producto por su id.

### 📦 Manejo de stock
- PATCH /api/productos/:id/stock
Suma o resta stock del producto especificado
Ejemplo de uso:
```bash
{
  "cantidad": -2
}
```

- PUT /api/productos/:id/stock/reset
Establece el stock en un valor fijo
Ejemplo de uso:
```bash
{
  "nuevoStock": 100
}
```

⚠️ El stock nunca baja de 0. Todos los cambios se guardan automáticamente en productos.json.

## 📁 Estructura de archivo productos.json
```bash
[
  {
    "id": 1,
    "nombre": "Camiseta Superhero",
    "precio": 14990,
    "stock": 20
  },
  {
    "id": 2,
    "nombre": "Taza Batman",
    "precio": 8990,
    "stock": 10
  }
]
```

## 📒 Documentación Swagger

Disponible en:

👉 http://localhost:3000/api-docs

Incluye documentación interactiva para probar todos los endpoints.