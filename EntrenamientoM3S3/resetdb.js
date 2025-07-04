// reset_db.js

const fs = require("fs");

// Initial dataset to reset the database
const initialData = {
  peliculas: [
    {
      id: "2",
      nombre: "El Padrino",
      foto: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      estrellas: 5,
      genero: "Drama"
    },
    {
      nombre: "Interstellar",
      foto: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
      estrellas: 5,
      genero: "Ciencia Ficción",
      id: "3"
    }
  ]
};

// Write the initial data into db.json (used by json-server)
fs.writeFileSync("db.json", JSON.stringify(initialData, null, 2));

// Log confirmation message
console.log("✅ Database reset with initial data.");

//If you want to restart the simple database Run this code in ("reset_db.js node")