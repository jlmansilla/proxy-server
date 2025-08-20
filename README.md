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
### SuperHero API (proxy)
- GET /api/superheroe/:name
Busca superhéroes por nombre.

- GET /api/superhero/:id
Busca superhéroes por ID.

### Productos (Archivo Local)
- GET api/productos
Lista todos los productos de la tienda.

- GET api/productos/:id
Consulta un producto por su id.
