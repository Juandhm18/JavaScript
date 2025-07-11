# Tienda Deportiva - Registro de Clientes

## Project Description

This project is an interactive web application designed for a sports store that allows customer information registration. The application includes a form to capture customer data (name, age, and favorite team), persistent data storage, and a session interaction counter.

## Main Features

### 📋 Registration Form
- **Name Field**: Captures the customer's name with validation
- **Age Field**: Captures the age with range validation (1–120 years)
- **Favorite Team Field**: Captures the customer's favorite sports team
- **Real-time validation**: Displays specific error messages
- **Responsive design**: Adapts to different screen sizes

### 💾 Data Persistence
- **Local Storage**: Customer data is permanently saved in the browser
- **Session Storage**: Interaction counter maintained during the session
- **Automatic recovery**: Data is automatically loaded when the page is reloaded

### 🎨 Interfaz de Usuario
- **Tema deportivo**: Diseño profesional con colores neutros
- **Tipografía moderna**: Uso de la fuente Inter para mejor legibilidad
- **Animaciones suaves**: Transiciones y efectos hover elegantes
- **Accesibilidad**: Soporte para navegación por teclado y lectores de pantalla

## Project Structure

```
EntrenamientoM3S4/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles with sports theme
├── script.js           # Full JavaScript logic
└── README.md           # Project documentation

```

## Technologies Used

- **HTML5**: Semantic and accessible structure
- **CSS3**: Modern styles with CSS variables and responsive design
- **JavaScript**: Functional programming logic
- **Local Storage API**: Persistent data storage
- **Session Storage API**: Temporary session storage

## Detailed Features

### 1. Data Capture
- Form with three required fields
- Real-time validation with specific error messages
- Prevents submission with invalid data

### 2. Storage
- **Local Storage**: Customer data (name, age, team, date)
- **Session Storage**: Current session interaction counter
- JSON format for complex data structure

### 3. Display
- Displays saved data in real-time
- Visible interaction counter
- Temporary confirmation messages
- Loading and error states

### 4. Data Management
- Button to clear all stored data
- Form auto-clears after saving
- Automatic data retrieval when page loads

## How to Use the Application 

### 1. Customer Registration
1. Open the index.html file in your browser
2. Fill out the form with:
   - **Name**: Your full name (minimum 2 characters)
   - **Age**: Your age (between 1 and 120 years)
   - **Favorite Team**: Your favorite sports team (minimum 2 characters)
3. Click on "Save Data"

### 2. Data Display
- Saved data will automatically appear in the "Stored Data" section
- The interaction counter updates with each action
- Data persists even after closing and reopening the browser

### 3. Data Management
- Use the "Clear Data" button to remove all stored information
- The session counter resets when the browser tab is closed

## Implemented Validations

### Name Field
- ✅ Required
- ✅ Minimum 2 characters
- ✅ Text only

### Age Field
- ✅ Required
- ✅ Number between 1 and 120
- ✅ Integers only

### Favorite Team Field
- ✅ Required
- ✅ Minimum 2 characters
- ✅ Free Text 

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

## Technical Features

### Error Handling
- Real-time form validation
- Field-specific error messages
- Prevents submission with invalid data
- Handles storage-related errors

### Performance
- Optimized and well-commented code
- Efficient use of storage APIs
- CSS animations for better user experience
- Asynchronous resource loading

## Contribution

To contribute to the project:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Author

Developed as part of JavaScript training for sports stores.

---

**Note**: This project is educational and designed to demonstrate web storage and DOM manipulation capabilities in customer registration applications for sports stores.