const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

const API_TOKEN = "0c599596942953e4fd026124008f7b72";
const API_BASE_URL = `https://superheroapi.com/api/${API_TOKEN}`;

app.use(cors());

app.get("/api/superheroe/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const response = await axios.get(`${API_BASE_URL}/search/${name}`);
    res.json(response.data);
  } catch (err) {
    console.error("Error al consultar la API:", err.message);
    res.status(500).json({ error: "Error al consultar SuperHero API" });
  }
});
app.get("/api/superhero/:id", async (req, res) => {
  const id = req.params.id;
  try {
    console.log(`${API_BASE_URL}/${id}`);
    const response = await axios.get(`${API_BASE_URL}/${id}`);

    res.json(response.data);
  } catch (err) {
    console.error("Error al consultar la API:", err.message);
    res.status(500).json({ error: "Error al consultar SuperHero API" });
  }
});

const productosRoutes = require('./routes/productos.routes');
app.use('/api/productos', productosRoutes);

app.post("/api/enviar-correo", express.json(), (req, res) => {
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Proxy activo en http://localhost:${PORT}`);
});
