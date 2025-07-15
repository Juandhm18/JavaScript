/**
 * 🔐 Módulo de Autenticación
 * 
 * Maneja la autenticación de usuarios y gestión de sesiones
 * 
 * @author Juan Diego Hernandez Martinez
 * @version 1.0.0
 */

/**
 * Obtiene el usuario actual desde localStorage
 * @returns {Object|null} Usuario actual o null si no hay sesión
 */
export function getCurrentUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si el usuario está autenticado
 */
export function isAuthenticated() {
  return getCurrentUser() !== null;
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} role - Rol a verificar
 * @returns {boolean} true si el usuario tiene el rol especificado
 */
export function hasRole(role) {
  const user = getCurrentUser();
  return user && user.role === role;
}

/**
 * Verifica si el usuario es administrador
 * @returns {boolean} true si el usuario es admin
 */
export function isAdmin() {
  return hasRole('admin');
}

/**
 * Verifica si el usuario es visitante
 * @returns {boolean} true si el usuario es visitante
 */
export function isVisitor() {
  return hasRole('visitor');
}

/**
 * Cierra la sesión del usuario
 */
export function logout() {
  try {
    localStorage.removeItem("user");
    console.log('Sesión cerrada exitosamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

/**
 * Guarda la información del usuario en localStorage
 * @param {Object} user - Información del usuario
 */
export function setUser(user) {
  try {
    localStorage.setItem("user", JSON.stringify(user));
    console.log('Usuario guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
}

/**
 * Obtiene el token de autenticación (si existe)
 * @returns {string|null} Token de autenticación
 */
export function getAuthToken() {
  const user = getCurrentUser();
  return user ? user.token : null;
}

/**
 * Valida las credenciales del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object|null>} Usuario si las credenciales son válidas
 */
export async function validateCredentials(username, password) {
  try {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    
    return users.find(
      user => user.username === username && user.password === password
    ) || null;
  } catch (error) {
    console.error('Error al validar credenciales:', error);
    return null;
  }
}
