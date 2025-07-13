// ========================================
// SERVICIO DE USUARIOS
// ========================================

/**
 * Clase para manejar las operaciones CRUD de usuarios
 */
class UserService {
    
    constructor() {
        this.resource = 'users';
    }

    /**
     * Obtiene todos los usuarios
     * @param {Object} filters - Filtros opcionales
     * @returns {Promise<Array>} - Promise con la lista de usuarios
     */
    async getAllUsers(filters = {}) {
        try {
            const users = await apiService.getAll(this.resource, filters);
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    /**
     * Obtiene un usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} - Promise con el usuario
     */
    async getUserById(id) {
        try {
            const user = await apiService.getById(this.resource, id);
            return user;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object>} - Promise con el usuario creado
     */
    async createUser(userData) {
        try {
            // Validar datos del usuario
            const errors = ValidationUtils.validateUserRegistration(userData);
            if (ValidationUtils.hasErrors(errors)) {
                throw new Error('Datos de usuario inválidos');
            }

            // Verificar si el email ya existe
            const existingUsers = await apiService.search(this.resource, { email: userData.email });
            if (existingUsers.length > 0) {
                throw new Error('El email ya está registrado');
            }

            // Agregar fecha de admisión si no existe
            if (!userData.dateOfAdmission) {
                userData.dateOfAdmission = new Date().toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            }

            const user = await apiService.create(this.resource, userData);
            console.log('Usuario creado:', user);
            return user;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    /**
     * Actualiza un usuario existente
     * @param {number} id - ID del usuario
     * @param {Object} userData - Datos a actualizar
     * @returns {Promise<Object>} - Promise con el usuario actualizado
     */
    async updateUser(id, userData) {
        try {
            // Obtener usuario actual para validar cambios
            const currentUser = await this.getUserById(id);
            
            // Si se está cambiando el email, verificar que no exista
            if (userData.email && userData.email !== currentUser.email) {
                const existingUsers = await apiService.search(this.resource, { email: userData.email });
                if (existingUsers.length > 0) {
                    throw new Error('El email ya está registrado');
                }
            }

            const user = await apiService.update(this.resource, id, userData);
            console.log('Usuario actualizado:', user);
            return user;
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    /**
     * Elimina un usuario
     * @param {number} id - ID del usuario
     * @returns {Promise<boolean>} - Promise con el resultado
     */
    async deleteUser(id) {
        try {
            // Verificar si el usuario tiene inscripciones activas
            const enrollments = await apiService.search('enrollments', { userId: id });
            if (enrollments.length > 0) {
                throw new Error('No se puede eliminar un usuario con inscripciones activas');
            }

            await apiService.delete(this.resource, id);
            console.log('Usuario eliminado:', id);
            return true;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }

    /**
     * Busca usuarios por criterios específicos
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Array>} - Promise con los usuarios encontrados
     */
    async searchUsers(filters = {}) {
        try {
            const users = await apiService.search(this.resource, filters);
            return users;
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            throw error;
        }
    }

    /**
     * Obtiene usuarios por rol
     * @param {string} role - Rol a filtrar
     * @returns {Promise<Array>} - Promise con los usuarios del rol
     */
    async getUsersByRole(role) {
        try {
            const users = await this.searchUsers({ role });
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios por rol:', error);
            throw error;
        }
    }

    /**
     * Obtiene usuarios administradores
     * @returns {Promise<Array>} - Promise con los administradores
     */
    async getAdmins() {
        return this.getUsersByRole('admin');
    }

    /**
     * Obtiene usuarios visitantes
     * @returns {Promise<Array>} - Promise con los visitantes
     */
    async getVisitors() {
        return this.getUsersByRole('visitor');
    }

    /**
     * Cambia el rol de un usuario
     * @param {number} id - ID del usuario
     * @param {string} newRole - Nuevo rol
     * @returns {Promise<Object>} - Promise con el usuario actualizado
     */
    async changeUserRole(id, newRole) {
        try {
            // Validar rol
            if (!['admin', 'visitor'].includes(newRole)) {
                throw new Error('Rol inválido');
            }

            const user = await this.updateUser(id, { role: newRole });
            console.log(`Rol de usuario ${id} cambiado a ${newRole}`);
            return user;
        } catch (error) {
            console.error('Error al cambiar rol de usuario:', error);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas de usuarios
     * @returns {Promise<Object>} - Promise con las estadísticas
     */
    async getUserStats() {
        try {
            const allUsers = await this.getAllUsers();
            const admins = allUsers.filter(user => user.role === 'admin');
            const visitors = allUsers.filter(user => user.role === 'visitor');

            return {
                total: allUsers.length,
                admins: admins.length,
                visitors: visitors.length,
                recentUsers: allUsers.filter(user => {
                    const admissionDate = new Date(user.dateOfAdmission);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return admissionDate >= thirtyDaysAgo;
                }).length
            };
        } catch (error) {
            console.error('Error al obtener estadísticas de usuarios:', error);
            throw error;
        }
    }

    /**
     * Verifica si un email está disponible
     * @param {string} email - Email a verificar
     * @param {number} excludeId - ID de usuario a excluir (para actualizaciones)
     * @returns {Promise<boolean>} - Promise con true si está disponible
     */
    async isEmailAvailable(email, excludeId = null) {
        try {
            const users = await this.searchUsers({ email });
            
            if (excludeId) {
                // Excluir el usuario actual en caso de actualización
                return users.length === 0 || users.every(user => user.id !== excludeId);
            }
            
            return users.length === 0;
        } catch (error) {
            console.error('Error al verificar disponibilidad de email:', error);
            throw error;
        }
    }
}

// Crear instancia global del servicio de usuarios
const userService = new UserService();

// Exportar para uso global
window.UserService = UserService;
window.userService = userService; 