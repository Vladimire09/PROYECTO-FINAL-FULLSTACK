import { setServers } from 'node:dns/promises';
setServers(["1.1.1.1", "8.8.8.8"]);

import app from "./app.js"; 
// Usamos "../" porque db.js está una carpeta ARRIBA de server.js
import connectDB from "./config/db.js"; 
connectDB();

// Usar el puerto que asigne Render o el 3000 por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});