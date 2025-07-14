// ========================================
// UTILIDADES DE VALIDACIÓN
// ========================================

/**
 * Clase para manejar validaciones de formularios y datos
 */
class ValidationUtils {
    
    /**
     * Valida si un campo está vacío
     * @param {string} value - Valor a validar
     * @returns {boolean} - true si está vacío, false si no
     */
    static isEmpty(value) {
        return !value || value.trim() === '';
    }

    /**
     * Valida formato de email
     * @param {string} email - Email a validar
     * @returns {boolean} - true si es válido, false si no
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida longitud mínima de un texto
     * @param {string} value - Texto a validar
     * @param {number} minLength - Longitud mínima requerida
     * @returns {boolean} - true si cumple, false si no
     */
    static hasMinLength(value, minLength) {
        return value && value.length >= minLength;
    }

    /**
     * Valida longitud máxima de un texto
     * @param {string} value - Texto a validar
     * @param {number} maxLength - Longitud máxima permitida
     * @returns {boolean} - true si cumple, false si no
     */
    static hasMaxLength(value, maxLength) {
        return value && value.length <= maxLength;
    }

    /**
     * Valida si un valor es un número
     * @param {any} value - Valor a validar
     * @returns {boolean} - true si es número, false si no
     */
    static isNumber(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    /**
     * Valida rango numérico
     * @param {number} value - Valor a validar
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {boolean} - true si está en rango, false si no
     */
    static isInRange(value, min, max) {
        const numValue = parseFloat(value);
        return numValue >= min && numValue <= max;
    }

    /**
     * Valida formato de teléfono
     * @param {string} phone - Teléfono a validar
     * @returns {boolean} - true si es válido, false si no
     */
    static isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    /**
     * Valida formato de fecha
     * @param {string} date - Fecha a validar
     * @returns {boolean} - true si es válida, false si no
     */
    static isValidDate(date) {
        const dateObj = new Date(date);
        return dateObj instanceof Date && !isNaN(dateObj);
    }

    /**
     * Valida que una fecha sea futura
     * @param {string} date - Fecha a validar
     * @returns {boolean} - true si es futura, false si no
     */
    static isFutureDate(date) {
        const dateObj = new Date(date);
        const today = new Date();
        return dateObj > today;
    }

    /**
     * Valida datos de usuario para registro
     * @param {Object} userData - Datos del usuario
     * @returns {Object} - Objeto con errores encontrados
     */
    static validateUserRegistration(userData) {
        const errors = {};

        // Validar nombre
        if (this.isEmpty(userData.name)) {
            errors.name = 'El nombre es obligatorio';
        } else if (!this.hasMinLength(userData.name, 2)) {
            errors.name = 'El nombre debe tener al menos 2 caracteres';
        } else if (!this.hasMaxLength(userData.name, 50)) {
            errors.name = 'El nombre no puede exceder 50 caracteres';
        }

        // Validar email
        if (this.isEmpty(userData.email)) {
            errors.email = 'El email es obligatorio';
        } else if (!this.isValidEmail(userData.email)) {
            errors.email = 'El formato del email no es válido';
        }

        // Validar contraseña
        if (this.isEmpty(userData.password)) {
            errors.password = 'La contraseña es obligatoria';
        } else if (!this.hasMinLength(userData.password, 6)) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validar teléfono
        if (userData.phone && !this.isValidPhone(userData.phone)) {
            errors.phone = 'El formato del teléfono no es válido';
        }

        // Validar número de matrícula
        if (userData.enrollNumber && !this.hasMinLength(userData.enrollNumber, 10)) {
            errors.enrollNumber = 'El número de matrícula debe tener al menos 10 caracteres';
        }

        return errors;
    }

    /**
     * Valida datos de usuario para login
     * @param {Object} loginData - Datos de login
     * @returns {Object} - Objeto con errores encontrados
     */
    static validateUserLogin(loginData) {
        const errors = {};

        // Validar email
        if (this.isEmpty(loginData.email)) {
            errors.email = 'El email es obligatorio';
        } else if (!this.isValidEmail(loginData.email)) {
            errors.email = 'El formato del email no es válido';
        }

        // Validar contraseña
        if (this.isEmpty(loginData.password)) {
            errors.password = 'La contraseña es obligatoria';
        }

        return errors;
    }

    /**
     * Valida datos de curso
     * @param {Object} courseData - Datos del curso
     * @returns {Object} - Objeto con errores encontrados
     */
    static validateCourse(courseData) {
        const errors = {};

        // Validar título
        if (this.isEmpty(courseData.title)) {
            errors.title = 'El título es obligatorio';
        } else if (!this.hasMinLength(courseData.title, 3)) {
            errors.title = 'El título debe tener al menos 3 caracteres';
        } else if (!this.hasMaxLength(courseData.title, 100)) {
            errors.title = 'El título no puede exceder 100 caracteres';
        }

        // Validar descripción
        if (this.isEmpty(courseData.description)) {
            errors.description = 'La descripción es obligatoria';
        } else if (!this.hasMinLength(courseData.description, 10)) {
            errors.description = 'La descripción debe tener al menos 10 caracteres';
        }

        // Validar fecha de inicio
        if (this.isEmpty(courseData.startDate)) {
            errors.startDate = 'La fecha de inicio es obligatoria';
        } else if (!this.isValidDate(courseData.startDate)) {
            errors.startDate = 'El formato de fecha no es válido';
        } else if (!this.isFutureDate(courseData.startDate)) {
            errors.startDate = 'La fecha de inicio debe ser futura';
        }

        // Validar duración
        if (this.isEmpty(courseData.duration)) {
            errors.duration = 'La duración es obligatoria';
        }

        // Validar capacidad
        if (courseData.capacity) {
            if (!this.isNumber(courseData.capacity)) {
                errors.capacity = 'La capacidad debe ser un número';
            } else if (!this.isInRange(courseData.capacity, 1, 100)) {
                errors.capacity = 'La capacidad debe estar entre 1 y 100';
            }
        }

        return errors;
    }

    /**
     * Muestra errores de validación en el DOM
     * @param {Object} errors - Objeto con errores
     * @param {string} formId - ID del formulario
     */
    static showValidationErrors(errors, formId) {
        // Limpiar errores anteriores
        this.clearValidationErrors(formId);

        // Mostrar nuevos errores
        Object.keys(errors).forEach(fieldName => {
            const errorElement = document.getElementById(`${fieldName}Error`);
            if (errorElement) {
                errorElement.textContent = errors[fieldName];
                errorElement.style.display = 'block';
            }
        });
    }

    /**
     * Limpia todos los errores de validación
     * @param {string} formId - ID del formulario
     */
    static clearValidationErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const errorElements = form.querySelectorAll('.error');
            errorElements.forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });
        }
    }

    /**
     * Valida si hay errores en un objeto
     * @param {Object} errors - Objeto con errores
     * @returns {boolean} - true si hay errores, false si no
     */
    static hasErrors(errors) {
        return Object.keys(errors).length > 0;
    }
}

// Exportar para uso global
window.ValidationUtils = ValidationUtils; 