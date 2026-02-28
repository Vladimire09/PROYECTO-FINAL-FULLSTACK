const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    genre: { type: String },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String }, // Para la portada del juego
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);