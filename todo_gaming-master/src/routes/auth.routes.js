const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users");

const router = express.Router();
const SECRET_KEY = "contrasena123";

// REGISTRO
router.post("/register", async (req, res) => {
    // 1. Agregamos "email" a la extracción de datos
    const { username, email, password, role } = req.body; 
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 2. Pasamos el "email" al método create
        const newUser = await User.create({ 
            username, 
            email, 
            password: hashedPassword, 
            role 
        });
        
        res.status(201).json({ message: "Usuario creado", userId: newUser._id });
    } catch (error) {
        // Tip: imprime el error en consola para ver detalles de validación o duplicados
        console.error(error); 
        res.status(400).json({ message: "Error al crear usuario", detail: error.message });
    }
});

// LOGIN (Para obtener el Token)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: "2h" }
        );
        res.json({ token });
    } else {
        res.status(401).json({ message: "Credenciales inválidas" });
    }
});

module.exports = router;