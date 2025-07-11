# Tienda Deportiva - Registro de Clientes

## Descripción del Proyecto

Este proyecto es una aplicación web interactiva diseñada para una tienda deportiva que permite registrar información de clientes. La aplicación incluye un formulario para capturar datos del cliente (nombre, edad y equipo favorito), almacenamiento persistente de datos, y un contador de interacciones de sesión.

## Características Principales

### 📋 Formulario de Registro
- **Campo Nombre**: Captura el nombre del cliente con validación
- **Campo Edad**: Captura la edad con validación de rango (1-120 años)
- **Campo Equipo Favorito**: Captura el equipo deportivo favorito del cliente
- **Validación en tiempo real**: Muestra mensajes de error específicos
- **Diseño responsivo**: Se adapta a diferentes tamaños de pantalla

### 💾 Persistencia de Datos
- **Local Storage**: Los datos del cliente se guardan permanentemente en el navegador
- **Session Storage**: Contador de interacciones que se mantiene durante la sesión
- **Recuperación automática**: Los datos se cargan automáticamente al recargar la página

### 🎨 Interfaz de Usuario
- **Tema deportivo**: Diseño profesional con colores neutros
- **Tipografía moderna**: Uso de la fuente Inter para mejor legibilidad
- **Animaciones suaves**: Transiciones y efectos hover elegantes
- **Accesibilidad**: Soporte para navegación por teclado y lectores de pantalla

## Estructura del Proyecto

```
EntrenamientoM3S4/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS con tema deportivo
├── script.js           # Lógica JavaScript completa
└── README.md           # Documentación del proyecto
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y diseño responsivo
- **JavaScript ES6+**: Lógica de programación funcional
- **Local Storage API**: Almacenamiento persistente de datos
- **Session Storage API**: Almacenamiento temporal de sesión

## Funcionalidades Detalladas

### 1. Captura de Datos
- Formulario con tres campos obligatorios
- Validación en tiempo real con mensajes de error específicos
- Prevención de envío con datos inválidos

### 2. Almacenamiento
- **Local Storage**: Datos del cliente (nombre, edad, equipo, fecha)
- **Session Storage**: Contador de interacciones de la sesión actual
- Formato JSON para estructura de datos compleja

### 3. Visualización
- Muestra de datos guardados en tiempo real
- Contador de interacciones visible
- Mensajes de confirmación temporales
- Estados de carga y error

### 4. Gestión de Datos
- Botón para limpiar todos los datos almacenados
- Limpieza automática del formulario después de guardar
- Recuperación automática de datos al cargar la página

## Cómo Usar la Aplicación

### 1. Registro de Cliente
1. Abre el archivo `index.html` en tu navegador
2. Completa el formulario con:
   - **Nombre**: Tu nombre completo (mínimo 2 caracteres)
   - **Edad**: Tu edad (entre 1 y 120 años)
   - **Equipo Favorito**: Tu equipo deportivo favorito (mínimo 2 caracteres)
3. Haz clic en "Guardar Datos"

### 2. Visualización de Datos
- Los datos guardados aparecerán automáticamente en la sección "Datos Almacenados"
- El contador de interacciones se actualiza con cada acción
- Los datos persisten incluso después de cerrar y abrir el navegador

### 3. Gestión de Datos
- Usa el botón "Limpiar Datos" para eliminar toda la información almacenada
- El contador de sesión se reinicia al cerrar la pestaña del navegador

## Validaciones Implementadas

### Campo Nombre
- ✅ Obligatorio
- ✅ Mínimo 2 caracteres
- ✅ Solo texto

### Campo Edad
- ✅ Obligatorio
- ✅ Número entre 1 y 120
- ✅ Solo números enteros

### Campo Equipo Favorito
- ✅ Obligatorio
- ✅ Mínimo 2 caracteres
- ✅ Texto libre

## Estructura de Datos

### Local Storage
```json
{
  "nombre": "Juan",
  "edad": 25,
  "equipo": "Liverpool",
  "fechaGuardado": "26/12/2024, 15:30:45"
}
```

### Session Storage
```json
{
  "contadorInteracciones": "5"
}
```

## Características Técnicas

### Manejo de Errores
- Validación de formularios en tiempo real
- Mensajes de error específicos por campo
- Prevención de envío con datos inválidos
- Manejo de errores de almacenamiento

### Rendimiento
- Código optimizado y comentado
- Uso eficiente de las APIs de almacenamiento
- Animaciones CSS para mejor experiencia de usuario
- Carga asíncrona de recursos

### Accesibilidad
- Estructura HTML semántica
- Etiquetas apropiadas para formularios
- Navegación por teclado
- Contraste de colores adecuado
- Textos alternativos donde sea necesario

## Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Móviles (iOS Safari, Chrome Mobile)

## Personalización

### Colores del Tema
El proyecto utiliza variables CSS que pueden ser fácilmente modificadas:

```css
:root {
    --primary-color: #1a1a1a;      /* Color principal */
    --secondary-color: #666666;     /* Color secundario */
    --accent-color: #e5e5e5;       /* Color de acento */
    --bg-primary: #ffffff;         /* Fondo principal */
    --bg-secondary: #f8f9fa;       /* Fondo secundario */
}
```

### Tipografía
- Fuente principal: Inter (Google Fonts)
- Pesos disponibles: 300, 400, 500, 600, 700
- Tamaños responsivos para diferentes dispositivos

## Mejoras Futuras

- [ ] Integración con base de datos
- [ ] Sistema de autenticación
- [ ] Historial de registros
- [ ] Exportación de datos
- [ ] Temas adicionales
- [ ] Modo oscuro
- [ ] Notificaciones push
- [ ] Sincronización en la nube

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Autor

Desarrollado como parte del entrenamiento de JavaScript para tiendas deportivas.

---

**Nota**: Este proyecto es educativo y está diseñado para demostrar las capacidades de almacenamiento web y manipulación del DOM en aplicaciones de registro de clientes para tiendas deportivas. 