console.log("Bienvenido al sistema interactivo de mensajes! ");

let nombre = prompt("Cual es tu nombre?");

if (nombre.trim() === '') {
    console.error("Error: El nombre nombre no es valido");
} else{
    let edad = prompt("Cuantos años tienes? ");
    edad = parseInt(edad);

    if(isNaN(edad)){
        console.error("Error: Por favor, Digita una edad valida en numeros.");
    }else if(edad>0 && edad<90){
        if (edad<18){
            alert(`Hola ${nombre} eres menor de edad. !Sigue aprendiendo y disfrutando del codigo!`);
        } else{
            alert(`Hola ${nombre} eres mayor de edad. !Preparate para grandes oportunidades en el mundo de la programación!`);
        }
    } else {
        console.error(`Hola ${nombre} lo siento pero la edad no es valida`);
    } 
}