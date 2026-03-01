import { setServers } from 'node:dns/promises';
setServers(["1.1.1.1", "8.8.8.8"]);

// Cambiamos require por import
import app from "./app.js"; 
import connectDB from "./db.js"; // Asegúrate de poner la extensión .js

connectDB();

const PORT = process.env.PORT || 3000; // Render asigna su propio puerto, es mejor usar esta variable

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});