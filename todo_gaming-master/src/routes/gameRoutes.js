const express = require('express');
const router = express.Router();
const Game = require('../models/games');
const { verifyToken, authorize } = require('../middleware/authmiddleware');

// 1. OBTENER TODOS LOS JUEGOS (Público)
router.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener juegos' });
    }
});

// 2. CREAR UN JUEGO (Solo Admin)
router.post('/', [verifyToken, authorize], async (req, res) => {
    try {
        const newGame = new Game(req.body);
        const gameSaved = await newGame.save();
        res.status(201).json(gameSaved);
    } catch (err) {
        res.status(400).json({ msg: 'Error al crear el juego' });
    }
});

// 3. ACTUALIZAR UN JUEGO (Solo Admin)
router.put('/:id', [verifyToken, authorize], async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ msg: 'Error al actualizar' });
    }
});

// 4. ELIMINAR UN JUEGO (Solo Admin)
router.delete('/:id', [verifyToken, authorize], async (req, res) => {
    try {
        await Game.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Juego eliminado correctamente' });
    } catch (err) {
        res.status(400).json({ msg: 'Error al eliminar' });
    }
});

module.exports = router;