// ========================================
// SERVICIO DE AUTENTICACIÓN
// ========================================

/**
 * Clase para manejar la autenticación de usuarios
 */
class AuthService {
    
    constructor() {
        // Verificar si hay una sesión activa al inicializar
        this.currentUser = this.getCurrentUser();
    }

    /**
     * Registra un nuevo usuario
     * @param {Object} userData - Datos del usuario a registrar
     * @returns {Promise<Object>} - Promise con el usuario registrado
     */
    async register(userData) {
        try {
            // Validar datos de registro
            const errors = ValidationUtils.validateUserRegistration(userData);
            if (ValidationUtils.hasErrors(errors)) {
                throw new Error('Datos de registro inválidos');
            }

            // Verificar si el email ya existe
            const existingUsers = await apiService.search('users', { email: userData.email });
            if (existingUsers.length > 0) {
                throw new Error('El email ya está registrado');
            }

            // Crear el usuario con rol por defecto
            const newUser = {
                ...userData,
                role: 'visitor', // Por defecto, los usuarios registrados son visitantes
                dateOfAdmission: new Date().toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            };

            // Guardar en la API
            const createdUser = await apiService.create('users', newUser);
            
            console.log('Usuario registrado exitosamente:', createdUser);
            return createdUser;

        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    /**
     * Inicia sesión de un usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} - Promise con los datos del usuario
     */
    async login(email, password) {
        try {
            // Validar datos de login
            const loginData = { email, password };
            const errors = ValidationUtils.validateUserLogin(loginData);
            if (ValidationUtils.hasErrors(errors)) {
                throw new Error('Datos de login inválidos');
            }

            // Buscar usuario por email
            const users = await apiService.search('users', { email });
            
            if (users.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            const user = users[0];

            // Verificar contraseña
            if (user.password !== password) {
                throw new Error('Contraseña incorrecta');
            }

            // Crear sesión del usuario
            this.createSession(user);
            
            console.log('Login exitoso:', user);
            return user;

        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    /**
     * Cierra la sesión del usuario actual
     */
    logout() {
        try {
            // Limpiar datos de sesión
            StorageManager.removeLocalStorage(STORAGE_KEYS.USER_SESSION);
            StorageManager.removeLocalStorage(STORAGE_KEYS.USER_DATA);
            StorageManager.removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
            
            // Limpiar sessionStorage
            StorageManager.clearSessionStorage();
            
            // Limpiar usuario actual
            this.currentUser = null;
            
            console.log('Sesión cerrada exitosamente');
            
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    /**
     * Crea una sesión para el usuario
     * @param {Object} user - Datos del usuario
     */
    createSession(user) {
        try {
            // Crear token de autenticación (simulado)
            const token = this.generateToken(user);
            
            // Guardar datos de sesión
            StorageManager.setLocalStorage(STORAGE_KEYS.USER_SESSION, {
                userId: user.id,
                email: user.email,
                role: user.role,
                loginTime: new Date().toISOString()
            });
            
            StorageManager.setLocalStorage(STORAGE_KEYS.USER_DATA, user);
            StorageManager.setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, token);
            
            // Actualizar usuario actual
            this.currentUser = user;
            
        } catch (error) {
            console.error('Error al crear sesión:', error);
            throw error;
        }
    }

    /**
     * Obtiene el usuario actual de la sesión
     * @returns {Object|null} - Datos del usuario o null si no hay sesión
     */
    getCurrentUser() {
        try {
            const userData = StorageManager.getLocalStorage(STORAGE_KEYS.USER_DATA);
            const session = StorageManager.getLocalStorage(STORAGE_KEYS.USER_SESSION);
            
            if (userData && session) {
                // Verificar si la sesión no ha expirado (24 horas)
                const loginTime = new Date(session.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    return userData;
                } else {
                    // Sesión expirada, limpiar datos
                    this.logout();
                }
            }
            
            return null;
            
        } catch (error) {
            console.error('Error al obtener usuario actual:', error);
            return null;
        }
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} - true si está autenticado, false si no
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} role - Rol a verificar
     * @returns {boolean} - true si tiene el rol, false si no
     */
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    /**
     * Verifica si el usuario es administrador
     * @returns {boolean} - true si es admin, false si no
     */
    isAdmin() {
        return this.hasRole('admin');
    }

    /**
     * Verifica si el usuario es visitante
     * @returns {boolean} - true si es visitante, false si no
     */
    isVisitor() {
        return this.hasRole('visitor');
    }

    /**
     * Genera un token de autenticación (simulado)
     * @param {Object} user - Datos del usuario
     * @returns {string} - Token generado
     */
    generateToken(user) {
        // En un entorno real, esto sería un JWT
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            timestamp: Date.now()
        };
        
        return btoa(JSON.stringify(payload));
    }

    /**
     * Valida un token de autenticación
     * @param {string} token - Token a validar
     * @returns {Object|null} - Datos del token o null si es inválido
     */
    validateToken(token) {
        try {
            const payload = JSON.parse(atob(token));
            const now = Date.now();
            
            // Verificar si el token no ha expirado (24 horas)
            if (now - payload.timestamp < 24 * 60 * 60 * 1000) {
                return payload;
            }
            
            return null;
            
        } catch (error) {
            console.error('Error al validar token:', error);
            return null;
        }
    }

    /**
     * Actualiza los datos del usuario actual
     * @param {Object} updatedData - Datos actualizados
     * @returns {Promise<Object>} - Promise con el usuario actualizado
     */
    async updateCurrentUser(updatedData) {
        try {
            if (!this.currentUser) {
                throw new Error('No hay usuario autenticado');
            }

            // Actualizar en la API
            const updatedUser = await apiService.update('users', this.currentUser.id, updatedData);
            
            // Actualizar datos locales
            this.currentUser = updatedUser;
            StorageManager.setLocalStorage(STORAGE_KEYS.USER_DATA, updatedUser);
            
            console.log('Usuario actualizado:', updatedUser);
            return updatedUser;
            
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    /**
     * Cambia la contraseña del usuario actual
     * @param {string} currentPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<boolean>} - Promise con el resultado
     */
    async changePassword(currentPassword, newPassword) {
        try {
            if (!this.currentUser) {
                throw new Error('No hay usuario autenticado');
            }

            // Verificar contraseña actual
            if (this.currentUser.password !== currentPassword) {
                throw new Error('Contraseña actual incorrecta');
            }

            // Validar nueva contraseña
            if (!ValidationUtils.hasMinLength(newPassword, 6)) {
                throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
            }

            // Actualizar contraseña
            await this.updateCurrentUser({ password: newPassword });
            
            console.log('Contraseña cambiada exitosamente');
            return true;
            
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            throw error;
        }
    }
}

// Crear instancia global del servicio de autenticación
const authService = new AuthService();

// Exportar para uso global
window.AuthService = AuthService;
window.authService = authService; 