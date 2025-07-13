// ========================================
// UTILIDADES DE ALMACENAMIENTO
// ========================================

/**
 * Clase para manejar el almacenamiento local y de sesión
 */
class StorageManager {
    
    /**
     * Guarda datos en localStorage
     * @param {string} key - Clave para almacenar los datos
     * @param {any} value - Valor a almacenar
     */
    static setLocalStorage(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    /**
     * Obtiene datos de localStorage
     * @param {string} key - Clave de los datos a obtener
     * @returns {any} - Datos almacenados o null si no existen
     */
    static getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error al obtener de localStorage:', error);
            return null;
        }
    }

    /**
     * Elimina datos de localStorage
     * @param {string} key - Clave de los datos a eliminar
     */
    static removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
        }
    }

    /**
     * Guarda datos en sessionStorage
     * @param {string} key - Clave para almacenar los datos
     * @param {any} value - Valor a almacenar
     */
    static setSessionStorage(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error al guardar en sessionStorage:', error);
        }
    }

    /**
     * Obtiene datos de sessionStorage
     * @param {string} key - Clave de los datos a obtener
     * @returns {any} - Datos almacenados o null si no existen
     */
    static getSessionStorage(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error al obtener de sessionStorage:', error);
            return null;
        }
    }

    /**
     * Elimina datos de sessionStorage
     * @param {string} key - Clave de los datos a eliminar
     */
    static removeSessionStorage(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Error al eliminar de sessionStorage:', error);
        }
    }

    /**
     * Limpia todo el localStorage
     */
    static clearLocalStorage() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
        }
    }

    /**
     * Limpia todo el sessionStorage
     */
    static clearSessionStorage() {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('Error al limpiar sessionStorage:', error);
        }
    }
}

// Constantes para las claves de almacenamiento
const STORAGE_KEYS = {
    USER_SESSION: 'userSession',
    USER_DATA: 'userData',
    AUTH_TOKEN: 'authToken',
    THEME: 'theme',
    LANGUAGE: 'language'
};

// Exportar para uso global
window.StorageManager = StorageManager;
window.STORAGE_KEYS = STORAGE_KEYS; 