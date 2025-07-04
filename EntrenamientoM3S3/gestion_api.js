// Funciones CRUD para películas, adaptadas desde prueba.js para uso general

const API_URL = 'http://localhost:3000/peliculas';

// Obtener todas las películas
async function obtenerPeliculas() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('No se pudieron obtener las películas.');
    const peliculas = await res.json();
    return peliculas;
  } catch (err) {
    console.error("❌ Error al obtener las películas:", err.message);
    throw err;
  }
}

// Agregar una nueva película (con comprobación de duplicados)
async function agregarPelicula({ nombre, genero, foto, estrellas }) {
  try {
    // Validación básica
    if (!nombre || !genero || !foto || typeof estrellas !== 'number' || estrellas < 0 || estrellas > 5) {
      throw new Error("Datos de película inválidos.");
    }
    // Comprobar duplicados
    const peliculas = await obtenerPeliculas();
    const existe = peliculas.some(p =>
      p.nombre.toLowerCase() === nombre.toLowerCase() &&
      p.genero.toLowerCase() === genero.toLowerCase()
    );
    if (existe) {
      throw new Error("La película ya existe. No se agregó.");
    }
    // Agregar
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, genero, foto, estrellas })
    });
    if (!res.ok) throw new Error('No se pudo agregar la película.');
    return await res.json();
  } catch (err) {
    console.error("❌ Error al agregar la película:", err.message);
    throw err;
  }
}

// Actualizar una película por id
async function actualizarPelicula(id, { nombre, genero, foto, estrellas }) {
  try {
    if (!id || !nombre || !genero || !foto || typeof estrellas !== 'number' || estrellas < 0 || estrellas > 5) {
      throw new Error("Datos de película inválidos.");
    }
    // Comprobar existencia
    const resCheck = await fetch(`${API_URL}/${id}`);
    if (!resCheck.ok) throw new Error("Película no encontrada.");
    // Actualizar
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, genero, foto, estrellas })
    });
    if (!res.ok) throw new Error('No se pudo actualizar la película.');
    return await res.json();
  } catch (err) {
    console.error("❌ Error al actualizar la película:", err.message);
    throw err;
  }
}

// Eliminar una película por id
async function eliminarPelicula(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Película no encontrada o no se pudo eliminar.");
    return true;
  } catch (err) {
    console.error("❌ Error al eliminar la película:", err.message);
    throw err;
  }
}

// Exportar funciones si se usa en un entorno de módulos
// export { obtenerPeliculas, agregarPelicula, actualizarPelicula, eliminarPelicula

