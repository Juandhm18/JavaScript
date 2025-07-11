// ========================================
// TIENDA DEPORTIVA - REGISTRO DE CLIENTES
// ========================================

// Variables globales para acceder a los elementos del DOM
let userNameInput;
let userAgeInput;
let userTeamInput;
let outputDiv;
let interactionCounter;
let messageContainer;

// Función que se ejecuta cuando la página se carga completamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar las variables con los elementos del DOM
    inicializarElementos();
    
    // Cargar datos guardados al iniciar la página
    cargarDatosGuardados();
    
    // Configurar el contador de interacciones
    configurarContador();
    
    // Agregar el evento al formulario
    configurarFormulario();
    
    console.log('Página cargada correctamente');
});

// ========================================
// PASO 1: CONFIGURACIÓN DEL PROYECTO
// ========================================

/**
 * Inicializa las variables con los elementos del DOM
 * Esto hace más fácil acceder a los elementos durante toda la aplicación
 */
function inicializarElementos() {
    userNameInput = document.getElementById('userName');
    userAgeInput = document.getElementById('userAge');
    userTeamInput = document.getElementById('userTeam');
    outputDiv = document.getElementById('output');
    interactionCounter = document.getElementById('interactionCounter');
    messageContainer = document.getElementById('messageContainer');
    
    console.log('Elementos del DOM inicializados');
}

/**
 * Configura el evento submit del formulario
 * Se ejecuta cuando el usuario hace clic en "Guardar Datos"
 */
function configurarFormulario() {
    const formulario = document.getElementById('userForm');
    
    formulario.addEventListener('submit', function(evento) {
        // Prevenir que el formulario se envíe de forma tradicional
        evento.preventDefault();
        
        // Incrementar el contador de interacciones
        incrementarContador();
        
        // Guardar los datos
        guardarDatos();
    });
    
    console.log('Formulario configurado correctamente');
}

// ========================================
// PASO 2: CAPTURA Y ALMACENAMIENTO DE DATOS
// ========================================

/**
 * Captura los datos del formulario y los guarda en Local Storage
 * Esta función se ejecuta cuando el usuario hace clic en "Guardar Datos"
 */
function guardarDatos() {
    // Obtener los valores de los campos
    const nombre = userNameInput.value.trim();
    const edad = userAgeInput.value.trim();
    const equipo = userTeamInput.value.trim();
    
    // Validar que los campos no estén vacíos
    if (!validarCampos(nombre, edad, equipo)) {
        return; // Si hay errores, no continuar
    }
    
    // Crear un objeto con los datos del usuario
    const datosUsuario = {
        nombre: nombre,
        edad: parseInt(edad), // Convertir a número
        equipo: equipo,
        fechaGuardado: new Date().toLocaleString() // Agregar fecha y hora
    };
    
    // Guardar en Local Storage
    localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));
    
    // Mostrar mensaje de éxito
    mostrarMensaje('Datos guardados correctamente en Local Storage', 'success');
    
    // Actualizar la visualización de datos
    cargarDatosGuardados();
    
    // Limpiar el formulario
    limpiarFormulario();
    
    console.log('Datos guardados:', datosUsuario);
}

/**
 * Valida que los campos del formulario contengan datos válidos
 * @param {string} nombre - El nombre ingresado
 * @param {string} edad - La edad ingresada
 * @param {string} equipo - El equipo favorito ingresado
 * @returns {boolean} - true si los datos son válidos, false si hay errores
 */
function validarCampos(nombre, edad, equipo) {
    let hayErrores = false;
    
    // Limpiar mensajes de error anteriores
    limpiarErrores();
    
    // Validar nombre
    if (nombre === '') {
        mostrarError('nameError', 'El nombre es obligatorio');
        hayErrores = true;
    } else if (nombre.length < 2) {
        mostrarError('nameError', 'El nombre debe tener al menos 2 caracteres');
        hayErrores = true;
    }
    
    // Validar edad
    if (edad === '') {
        mostrarError('ageError', 'La edad es obligatoria');
        hayErrores = true;
    } else {
        const edadNumero = parseInt(edad);
        if (isNaN(edadNumero) || edadNumero < 1 || edadNumero > 120) {
            mostrarError('ageError', 'La edad debe estar entre 1 y 120 años');
            hayErrores = true;
        }
    }
    
    // Validar equipo
    if (equipo === '') {
        mostrarError('teamError', 'El equipo favorito es obligatorio');
        hayErrores = true;
    } else if (equipo.length < 2) {
        mostrarError('teamError', 'El equipo debe tener al menos 2 caracteres');
        hayErrores = true;
    }
    
    return !hayErrores; // Retorna true si NO hay errores
}

/**
 * Muestra un mensaje de error en el campo especificado
 * @param {string} campoId - ID del campo donde mostrar el error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(campoId, mensaje) {
    const errorDiv = document.getElementById(campoId);
    errorDiv.textContent = mensaje;
}

/**
 * Limpia todos los mensajes de error
 */
function limpiarErrores() {
    document.getElementById('nameError').textContent = '';
    document.getElementById('ageError').textContent = '';
    document.getElementById('teamError').textContent = '';
}

/**
 * Limpia el formulario después de guardar los datos
 */
function limpiarFormulario() {
    userNameInput.value = '';
    userAgeInput.value = '';
    userTeamInput.value = '';
    userNameInput.focus(); // Poner el cursor en el primer campo
}

// ========================================
// PASO 3: RECUPERACIÓN Y VISUALIZACIÓN DE DATOS
// ========================================

/**
 * Carga los datos guardados en Local Storage y los muestra en la página
 * Esta función se ejecuta al cargar la página y después de guardar datos
 */
function cargarDatosGuardados() {
    // Obtener datos del Local Storage
    const datosGuardados = localStorage.getItem('datosUsuario');
    
    if (datosGuardados) {
        // Convertir el JSON de vuelta a objeto
        const datosUsuario = JSON.parse(datosGuardados);
        
        // Crear el HTML para mostrar los datos
        const htmlDatos = `
            <div class="user-data">
                <h3>Información del Cliente</h3>
                <p><strong>Nombre:</strong> ${datosUsuario.nombre}</p>
                <p><strong>Edad:</strong> ${datosUsuario.edad} años</p>
                <p><strong>Equipo Favorito:</strong> ${datosUsuario.equipo}</p>
                <p><strong>Guardado el:</strong> ${datosUsuario.fechaGuardado}</p>
            </div>
        `;
        
        // Mostrar los datos en la página
        outputDiv.innerHTML = htmlDatos;
        
        console.log('Datos cargados del Local Storage:', datosUsuario);
    } else {
        // Si no hay datos guardados, mostrar mensaje
        outputDiv.innerHTML = `
            <div class="no-data">
                <p>No hay información almacenada en Local Storage.</p>
                <p>Completa el formulario y haz clic en "Guardar Datos" para comenzar.</p>
            </div>
        `;
        
        console.log('No hay datos guardados en Local Storage');
    }
}

// ========================================
// PASO 4: CONTADOR CON SESSION STORAGE
// ========================================

/**
 * Configura el contador de interacciones usando Session Storage
 * Se ejecuta al cargar la página
 */
function configurarContador() {
    // Obtener el contador actual del Session Storage
    let contador = sessionStorage.getItem('contadorInteracciones');
    
    // Si no existe, inicializar en 0
    if (contador === null) {
        contador = 0;
    } else {
        contador = parseInt(contador);
    }
    
    // Mostrar el contador en la página
    actualizarContadorVisual(contador);
    
    console.log('Contador de interacciones inicializado:', contador);
}

/**
 * Incrementa el contador de interacciones
 * Se ejecuta cada vez que el usuario interactúa con la página
 */
function incrementarContador() {
    // Obtener el contador actual
    let contador = sessionStorage.getItem('contadorInteracciones');
    
    // Si no existe, inicializar en 0
    if (contador === null) {
        contador = 0;
    } else {
        contador = parseInt(contador);
    }
    
    // Incrementar el contador
    contador++;
    
    // Guardar el nuevo valor en Session Storage
    sessionStorage.setItem('contadorInteracciones', contador.toString());
    
    // Actualizar la visualización
    actualizarContadorVisual(contador);
    
    console.log('Contador incrementado:', contador);
}

/**
 * Actualiza la visualización del contador en la página
 * @param {number} contador - El valor actual del contador
 */
function actualizarContadorVisual(contador) {
    interactionCounter.textContent = contador;
}

// ========================================
// PASO 5: LIMPIEZA DE DATOS
// ========================================

/**
 * Limpia todos los datos almacenados en Local Storage
 * Esta función se ejecuta cuando el usuario hace clic en "Limpiar Datos"
 */
function limpiarDatos() {
    // Incrementar el contador de interacciones
    incrementarContador();
    
    // Eliminar datos del Local Storage
    localStorage.removeItem('datosUsuario');
    
    // Mostrar mensaje de confirmación
    mostrarMensaje('Datos eliminados correctamente del Local Storage', 'success');
    
    // Actualizar la visualización
    cargarDatosGuardados();
    
    // Limpiar el formulario
    limpiarFormulario();
    
    console.log('Datos eliminados del Local Storage');
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Muestra un mensaje temporal en la página
 * @param {string} mensaje - El mensaje a mostrar
 * @param {string} tipo - El tipo de mensaje ('success' o 'error')
 */
function mostrarMensaje(mensaje, tipo) {
    // Crear el elemento del mensaje
    const mensajeElement = document.createElement('div');
    mensajeElement.className = tipo;
    mensajeElement.textContent = mensaje;
    mensajeElement.style.padding = '10px';
    mensajeElement.style.marginTop = '10px';
    mensajeElement.style.borderRadius = '5px';
    mensajeElement.style.textAlign = 'center';
    
    // Agregar el mensaje al contenedor
    messageContainer.innerHTML = '';
    messageContainer.appendChild(mensajeElement);
    
    // Eliminar el mensaje después de 3 segundos
    setTimeout(function() {
        if (mensajeElement.parentNode) {
            mensajeElement.parentNode.removeChild(mensajeElement);
        }
    }, 3000);
}

// ========================================
// INFORMACIÓN ADICIONAL PARA EL ESTUDIANTE
// ========================================

/*
CONCEPTOS IMPORTANTES APRENDIDOS:

1. LOCAL STORAGE:
   - localStorage.setItem('clave', 'valor') - Guardar datos
   - localStorage.getItem('clave') - Obtener datos
   - localStorage.removeItem('clave') - Eliminar datos
   - Los datos persisten incluso después de cerrar el navegador

2. SESSION STORAGE:
   - sessionStorage.setItem('clave', 'valor') - Guardar datos
   - sessionStorage.getItem('clave') - Obtener datos
   - Los datos se eliminan al cerrar la pestaña del navegador

3. JSON:
   - JSON.stringify(objeto) - Convertir objeto a texto
   - JSON.parse(texto) - Convertir texto a objeto

4. EVENTOS:
   - addEventListener('submit', funcion) - Escuchar eventos del formulario
   - preventDefault() - Prevenir comportamiento por defecto

5. VALIDACIÓN:
   - Verificar que los campos no estén vacíos
   - Validar rangos de números
   - Mostrar mensajes de error específicos

6. MANIPULACIÓN DEL DOM:
   - getElementById() - Obtener elementos por ID
   - innerHTML - Cambiar contenido HTML
   - textContent - Cambiar texto
   - value - Obtener/cambiar valor de inputs

7. FUNCIONES:
   - Declaración de funciones con parámetros
   - Retorno de valores
   - Comentarios para documentar código

8. VARIABLES:
   - let para variables que cambian
   - const para valores constantes
   - Nombres descriptivos en camelCase

¡FELICITACIONES! Has completado exitosamente el ejercicio de persistencia de datos.
*/ 