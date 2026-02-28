// backend/seed.js
const mongoose = require('mongoose');
const Game = require('./models/games');

mongoose.connect("mongodb://127.0.0.1:27017/tienda")
  .then(async () => {
    console.log("Conectado para insertar datos...");
    
    const juegosEjemplo = [
      {
        title: "Bloodborne",
        description: "Un RPG de acción gótico y horror.",
        price: 120,
        genre: "Survival horror",
        stock: 10,
        imageUrl: "https://www.psu.com/wp/wp-content/uploads/2017/11/bloodborne.jpg"
      },
      {
        title: "Gears 3",
        description: "La épica conclusión de la trilogía original.",
        price: 180,
        genre: "Shooter",
        stock: 5,
        imageUrl: "https://tse1.mm.bing.net/th/id/OIP.dugiYDhs2_sterBkYrf8ogHaJW?rs=1&pid=ImgDetMain"
      }
    ];

    await Game.insertMany(juegosEjemplo);
    console.log("¡Juegos insertados correctamente!");
    process.exit();
  })
  .catch(err => console.error(err));