// 1. Crea un array que almacene cinco animales
let animales = ['perro', 'gato', 'elefante', 'tigre', 'loro'];

// 2. Añade dos más. Uno al principio y otro al final
animales.unshift('delfin');
animales.push('lobo');

// 3. Elimina el que se encuentra en tercera posición
animales.splice(2,1);

// 4. Crea un set que almacene cinco libros
let libros = new Set(['el principito', 'la iliada', 'Hush Hush', 'el rey leon', 'the rain']);

// 5. Añade dos más. Uno de ellos repetido
libros.add("cien años de soledad");
libros.add("cien años de soledad");
libros.add('La odisea');

// 6. Elimina uno concreto a tu elección
console.log(libros.delete("el principito"))

// 7. Crea un mapa que asocie el número del mes a su nombre
let Meses = new Map([
    ["1", "Enero"],
    ["2", "Febrero"],
    ["3", "Marzo"],
    ["4", "Abril"],
    ["5", "Mayo"],
    ["6", "Junio"]
])

// 8. Comprueba si el mes número 5 existe en el map e imprime su valor
console.log(Meses.has("5"));

// 9. Añade al mapa una clave con un array que almacene los meses de verano
Meses.set("mesVerano", ["Abril", "Mayo", "Junio"])
console.log(Meses.get("mesVerano"))
// 10. Crea un Array, transfórmalo a un Set y almacénalo en un Map
let numeros = [1, 2, 3, 4, 5, 5, 3];
let numerosSet = new Set(numeros);
let mapNumeros = new Map();
mapNumeros.set("numerosUnicos", numerosSet);
console.log(mapNumeros.get("numerosUnicos"));
