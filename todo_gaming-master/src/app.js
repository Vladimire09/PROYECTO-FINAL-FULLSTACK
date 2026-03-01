import express from "express";
import authRoutes from "./routes/auth.routes.js";
import gamesRoutes from "./routes/gameRoutes";
import userActionsRoutes from './routes/userActions.routes';
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
