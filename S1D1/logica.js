// Escribe un programa que reciba tres números positivos que representan las longitudes de los lados de un triángulo. El programa debe determinar si los lados forman un triángulo válido y, si es válido, clasificarlo como:

//     Equilátero: todos los lados son iguales.
//     Isósceles: dos lados son iguales.
//     Escaleno: todos los lados son diferentes.

// Si los lados no forman un triángulo válido, muestra un mensaje de error.

function checkEnter(event) {
    if (event.key === "Enter") {
        OptionSelected();
    }
}

function OptionSelected(){
    const input = document.getElementById('Selection');
    let opcion = input.value;
    if (opcion == 1){
        calcularTriangulo();
    }
}

function calcularTriangulo(){
    alert("Vamos crear un triangulo, primero validemos sus longitudes...");
    let lado1 = prompt("Ingresa el primer lado del triangulo ");
    let lado2 = prompt("Ingresa el segundo lado del triangulo ");
    let lado3 = prompt("Ingresa el tercer lado del triangulo ");
    if (((lado1 + lado2) > lado3)||((lado1 + lado3) > lado2)||((lado2 + lado3)>lado1)){
        if (lado1 == lado2 && lado1 == lado3){
            console.log("Tenemos un triangulo Equilátero");
        } else if(lado1 == lado2 || lado1 == lado3 || lado3 == lado2){
            console.log("Tenemos un triangulo Isósceles");
        } else{
            console.log("Tenemos un triangulo Escaleno");
    }}else{
        console.error("Los lados no forman ningun triangulo");
    }
}

