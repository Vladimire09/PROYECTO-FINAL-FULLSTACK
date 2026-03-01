import express from "express";
const authRoutes = require("./routes/auth.routes");
const gamesRoutes = require("./routes/gameRoutes");
const userActionsRoutes = require('./routes/userActions.routes')
const app = express();
const cors = require("cors"); // <--- 1. Importar cors

app.use(cors()); // <--- 2. Habilitar cors para TODOS los puertos
app.use(express.json());

// ... tus rutas de /auth y /games van después de esto ...
app.use(express.json());
app.use('/api/user', userActionsRoutes);
app.use("/auth", authRoutes);   // Para login y registro
app.use("/games", gamesRoutes); // Para el CRUD de videojuegos

export default app;
