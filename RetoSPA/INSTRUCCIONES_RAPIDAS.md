# 🚀 Instrucciones Rápidas - Biblioteca Pública SPA

## Ejecución Rápida

### Opción 1: Con npm (Recomendado)
```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo (ambos servidores)
npm run dev
```

### Opción 2: Manual
```bash
# 1. Instalar json-server globalmente
npm install -g json-server

# 2. Iniciar el servidor de base de datos
json-server --watch db.json --port 3000

# 3. En otra terminal, abrir la aplicación
# Opción A: Abrir index.html directamente en el navegador
# Opción B: Usar un servidor local
python -m http.server 8000
# o
npx http-server
```

## Acceso a la Aplicación

- **Frontend:** http://localhost:8000
- **API Backend:** http://localhost:3000

## Usuarios de Prueba

### Bibliotecario
- Email: `admin@biblioteca.com`
- Contraseña: `admin123`

### Visitante
- Email: `juan@email.com`
- Contraseña: `user123`

## Estructura de Archivos

```
RetoSPA/
├── index.html                    # Página principal
├── app.js                       # Lógica de la SPA
├── styles.css                   # Estilos CSS
├── db.json                     # Base de datos simulada
├── package.json                # Configuración npm
├── README.md                  # Documentación completa
├── INSTRUCCIONES_RAPIDAS.md   # Este archivo
└── Biblioteca_API.postman_collection.json  # Pruebas API
```

## Funcionalidades Principales

✅ **Autenticación completa** con roles (bibliotecario/visitante)
✅ **Gestión de libros** (CRUD completo para bibliotecarios)
✅ **Sistema de reservas** (crear y visualizar)
✅ **Rutas protegidas** según rol de usuario
✅ **Persistencia de sesión** con localStorage
✅ **Interfaz responsiva** y moderna
✅ **Sincronización con API** json-server

## Solución de Problemas

### Error de conexión
- Verificar que json-server esté ejecutándose en puerto 3000
- Comprobar que las URLs en app.js sean correctas

### Problemas de rendimiento
- La aplicación está optimizada para cargas pequeñas
- Para grandes volúmenes, considerar paginación

## Próximos Pasos

1. Personalizar la información del desarrollador en README.md
2. Configurar el repositorio Git
3. Probar todos los endpoints con Postman
4. Desplegar en GitHub Pages o similar

---

**¡Listo para usar!** 🎉 