const jwt = require('jsonwebtoken');
const SECRET_KEY = "contrasena123"; // Asegúrate que sea la misma que en auth.routes.js

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "No se proporcionó un token" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido" });
        }
        // Guardamos los datos decodificados en el objeto request (req)
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next(); // <--- IMPORTANTE: Permite pasar al siguiente middleware (isAdmin)
    });
};

const authorize = (req, res, next) => {
    // Verificamos el rol que guardamos en verifyToken
    if (req.userRole === 'admin') {
        next(); // <--- Si es admin, permite pasar a la ruta de crear juego
    } else {
        res.status(403).json({ message: "Requiere rol de Administrador" }); 
        // Si no es admin, enviamos respuesta inmediata para que no se quede cargando
    }
};

module.exports = { verifyToken, authorize };