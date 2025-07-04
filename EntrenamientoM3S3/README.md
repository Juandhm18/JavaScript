# Movie Management Application

A web-based movie management system built with vanilla JavaScript that allows users to perform CRUD operations (Create, Read, Update, Delete) on movie data through a RESTful API.

## Features

- **View Movies**: Display all movies in a card-based layout with star ratings
- **Add Movies**: Add new movies with validation and duplicate checking
- **Edit Movies**: Inline editing of movie information
- **Delete Movies**: Remove movies with confirmation dialog
- **Form Validation**: Real-time validation for all input fields
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error messages and user feedback

## Project Structure

```
EntrenamientoM3S3/
├── index.html          # Main HTML file
├── gestion_api.js      # Main JavaScript application
├── styles.css          # Styling for the application
├── db.json             # JSON database file
├── resetdb.js          # Database reset utility
└── README.md           # This file
```

## Prerequisites

Before running this application, you need to have:

1. **Node.js** installed on your system
2. **json-server** package (for the REST API)

## Installation & Setup

### 1. Install json-server

```bash
npm install -g json-server
```

### 2. Start the JSON Server

Navigate to the project directory and run:

```bash
json-server --watch db.json --port 3000
```

This will start a REST API server at `http://localhost:3000` that serves the movie data from `db.json`.

### 3. Open the Application

Open `index.html` in your web browser. You can do this by:
- Double-clicking the file
- Using a local server (recommended)
- Opening it through your code editor's live server extension

## How It Works

### API Integration

The application uses the following API endpoints:

- `GET /peliculas` - Retrieve all movies
- `POST /peliculas` - Add a new movie
- `PUT /peliculas/:id` - Update an existing movie
- `DELETE /peliculas/:id` - Delete a movie

### Core Functions

#### API Functions (from gestion_api.js integration)
- `obtenerPeliculas()` - Fetches all movies from the API
- `agregarPelicula(movieData)` - Adds a new movie with duplicate checking
- `actualizarPelicula(id, movieData)` - Updates an existing movie
- `eliminarPelicula(id)` - Deletes a movie by ID

#### UI Functions
- `showMovies()` - Displays all movies in the interface
- `createMovieCard(movie)` - Creates HTML for individual movie cards
- `validateMovie(movieData)` - Validates movie data before submission
- `toggleAddForm(show)` - Shows/hides the add movie form

### Data Structure

Each movie object contains:
```javascript
{
  "id": 1,
  "nombre": "Movie Name",
  "genero": "Action",
  "foto": "https://example.com/image.jpg",
  "estrellas": 4
}
```

### Validation Rules

- **Name**: Required, non-empty string
- **Photo**: Required, valid URL
- **Genre**: Required, non-empty string
- **Stars**: Required, number between 0-5

## Usage

### Adding a Movie
1. Click the "Add Movie" button
2. Fill in the form with movie details
3. Click "Save" to add the movie
4. The form will validate inputs and check for duplicates

### Editing a Movie
1. Click the "Edit" button on any movie card
2. Modify the information in the inline form
3. Click "Save" to update or "Cancel" to discard changes

### Deleting a Movie
1. Click the "Delete" button on any movie card
2. Confirm the deletion in the dialog
3. The movie will be removed from the list

## Error Handling

The application includes comprehensive error handling:
- Network errors are displayed to the user
- Form validation shows field-specific errors
- Duplicate movie detection prevents data conflicts
- API errors are logged to console and shown to user

## Troubleshooting

### Common Issues

1. **Movies not loading**: Make sure json-server is running on port 3000
2. **Cannot add movies**: Check that the API server is accessible
3. **Form validation errors**: Ensure all required fields are filled correctly
4. **Duplicate movie error**: The movie name and genre combination already exists

### Reset Database

If you need to reset the database to its initial state, run:

```bash
node resetdb.js
```
This will restore the original sample data in `db.json`.

## Development

## License
This project is for educational purposes as part of the RIWI training program. 