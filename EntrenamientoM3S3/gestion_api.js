fetch('http://localhost:3000/productos')
    .then(response => response.json())
    .then(data => console.log("Productos disponibles:", data))
    .catch(error => console.error("Error al obtener productos:", error));

const nuevoProducto = {nombre: "monitor", precio:200};

fetch('http://localhost:3000/productos',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(nuevoProducto)
})
    .then(response => response.json())
    .then(data => console.log("Productos agregado:", data))
    .catch(error => console.error("Error al agregar productos:", error));

const productoActualizado = {nombre: "laptop", precio:1400};

fetch('http://localhost:3000/productos/1',{
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(productoActualizado)
})
    .then(response => response.json())
    .then(data => console.log("Productos actualizado:", data))
    .catch(error => console.error("Error al actualizar productos:", error));

fetch('http://localhost:3000/productos/3',{ method: "DELETE"})

    .then(() => console.log("Producto eliminado"))
    .catch(error => console.error("Error al eliminar productos:", error));

function validarProducto(producto){
    if (!producto.nombre || typeof producto.precio !== "number"){
        console.error("Datos del producto no válidos.");
        return false;
    }  
    return true;
}