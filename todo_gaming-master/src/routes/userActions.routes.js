const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { verifyToken } = require('../middleware/authmiddleware');

// --- CARRITO ---

// Agregar al carrito
router.post('/cart/add', verifyToken, async (req, res) => {
    try {
        const { gameId } = req.body;
        // $addToSet evita que se duplique el mismo juego en la lista
        await User.findByIdAndUpdate(req.userId, { $addToSet: { cart: gameId } });
        res.json({ msg: "Juego agregado al carrito" });
    } catch (err) {
        res.status(500).json({ msg: "Error al agregar al carrito" });
    }
});

// Obtener carrito (con datos de los juegos)
router.get('/cart', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('cart');
        
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
        
        console.log("Carrito actual del usuario:", user.cart);
        res.json(user.cart || []); 
    } catch (err) {
        // Mira la terminal de VS Code cuando esto falle
        console.error("ERROR EN GET CART:", err.message); 
        res.status(500).json({ msg: "Error de servidor", error: err.message });
    }
});

// Eliminar del carrito
router.delete('/cart/remove/:gameId', verifyToken, async (req, res) => {
    try {
        const { gameId } = req.params;
        const user = await User.findByIdAndUpdate(
            req.userId, 
            { $pull: { cart: gameId } }, 
            { new: true } // Para devolver el documento actualizado
        );
        res.json({ msg: "Juego eliminado del carrito", cart: user.cart });
    } catch (err) {
        res.status(500).json({ msg: "Error al eliminar del carrito" });
    }
});

// --- LISTA DE DESEOS (WISHLIST) ---

// Agregar a wishlist
router.post('/wishlist/add', verifyToken, async (req, res) => {
    try {
        const { gameId } = req.body;
        // Usamos $addToSet para que no se duplique el mismo juego si el usuario hace clic varias veces
        await User.findByIdAndUpdate(req.userId, { 
            $addToSet: { wishlist: gameId } 
        });
        res.json({ msg: "Juego añadido a tu lista de deseos" });
    } catch (err) {
        res.status(500).json({ msg: "Error al guardar en wishlist", error: err.message });
    }
});

router.get('/wishlist', verifyToken, async (req, res) => {
    try {
        // Buscamos al usuario por el ID del token y "poblamos" el arreglo wishlist
        const user = await User.findById(req.userId).populate('wishlist');
        
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Si la wishlist está vacía o no existe, devolvemos un arreglo vacío
        res.json(user.wishlist || []);
    } catch (err) {
        console.error("Error en GET wishlist:", err.message);
        res.status(500).json({ msg: "Error al obtener la lista de deseos", error: err.message });
    }
});

router.delete('/wishlist/remove/:gameId', verifyToken, async (req, res) => {
    try {
        const { gameId } = req.params;
        const user = await User.findByIdAndUpdate(
            req.userId, 
            { $pull: { wishlist: gameId } }, 
            { new: true }
        );
        res.json({ msg: "Juego eliminado de la lista de deseos", wishlist: user.wishlist });
    } catch (err) {
        res.status(500).json({ msg: "Error al eliminar de wishlist" });
    }
});

module.exports = router;