// ========================================
// ARCHIVO PRINCIPAL DE LA APLICACIÓN
// ========================================

/**
 * Clase principal de la aplicación
 */
class App {
    
    constructor() {
        this.isInitialized = false;
        this.apiAvailable = false;
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        try {
            console.log('Inicializando aplicación...');
            
            // Verificar disponibilidad de la API
            await this.checkApiAvailability();
            
            // Inicializar componentes
            this.initializeComponents();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            // Inicializar router
            router.init();
            
            this.isInitialized = true;
            console.log('Aplicación inicializada correctamente');
            
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            this.showInitializationError();
        }
    }

    /**
     * Verifica la disponibilidad de la API
     */
    async checkApiAvailability() {
        try {
            this.apiAvailable = await apiService.isAvailable();
            if (!this.apiAvailable) {
                throw new Error('API no disponible');
            }
            console.log('API disponible');
        } catch (error) {
            console.error('Error al verificar API:', error);
            throw new Error('No se pudo conectar con el servidor. Asegúrate de que json-server esté ejecutándose.');
        }
    }

    /**
     * Inicializa los componentes de la aplicación
     */
    initializeComponents() {
        // Inicializar header
        headerComponent.init();
        
        // Inicializar sidebar
        sidebarComponent.init();
        
        // Inicializar modal
        // (No necesita inicialización específica)
    }

    /**
     * Configura eventos globales de la aplicación
     */
    setupGlobalEvents() {
        // Eventos de formularios
        this.setupFormEvents();
        
        // Eventos de autenticación
        this.setupAuthEvents();
        
        // Eventos de gestión de datos
        this.setupDataEvents();
    }

    /**
     * Configura eventos de formularios
     */
    setupFormEvents() {
        // Evento global para formularios
        document.addEventListener('submit', (e) => {
            const form = e.target;
            
            // Formulario de login
            if (form.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin(form);
            }
            
            // Formulario de registro
            if (form.id === 'registerForm') {
                e.preventDefault();
                this.handleRegister(form);
            }
        });
    }

    /**
     * Configura eventos de autenticación
     */
    setupAuthEvents() {
        // Escuchar cambios en el estado de autenticación
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEYS.USER_SESSION) {
                headerComponent.updateAuthState();
                sidebarComponent.updateAuthState();
            }
        });
    }

    /**
     * Configura eventos de gestión de datos
     */
    setupDataEvents() {
        // Eventos para botones de acción
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Botones de inscripción
            if (target.classList.contains('enroll-btn')) {
                e.preventDefault();
                const courseId = target.getAttribute('data-course-id');
                this.handleEnrollment(courseId);
            }
            
            // Botones de cancelación de inscripción
            if (target.classList.contains('cancel-enrollment-btn')) {
                e.preventDefault();
                const enrollmentId = target.getAttribute('data-enrollment-id');
                this.handleCancelEnrollment(enrollmentId);
            }
        });
    }

    /**
     * Maneja el login de usuarios
     * @param {HTMLFormElement} form - Formulario de login
     */
    async handleLogin(form) {
        try {
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');

            // Validar datos
            const errors = ValidationUtils.validateUserLogin({ email, password });
            if (ValidationUtils.hasErrors(errors)) {
                ValidationUtils.showValidationErrors(errors, 'loginForm');
                return;
            }

            // Limpiar errores
            ValidationUtils.clearValidationErrors('loginForm');

            // Mostrar loading
            modalComponent.showLoadingModal('Iniciando sesión...');

            // Realizar login
            const user = await authService.login(email, password);

            // Ocultar loading
            modalComponent.hideLoadingModal();

            // Actualizar componentes
            headerComponent.updateAuthState();
            sidebarComponent.updateAuthState();

            // Mostrar mensaje de éxito
            headerComponent.showMessage('Sesión iniciada exitosamente', 'success');

            // Redirigir según el rol
            if (user.role === 'admin') {
                router.navigateTo('dashboard');
            } else {
                router.navigateTo('my-courses');
            }

        } catch (error) {
            modalComponent.hideLoadingModal();
            console.error('Error en login:', error);
            
            // Mostrar error específico
            const errorMessage = error.message || 'Error al iniciar sesión';
            headerComponent.showMessage(errorMessage, 'danger');
        }
    }

    /**
     * Maneja el registro de usuarios
     * @param {HTMLFormElement} form - Formulario de registro
     */
    async handleRegister(form) {
        try {
            const formData = new FormData(form);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                phone: formData.get('phone') || ''
            };

            // Validar datos
            const errors = ValidationUtils.validateUserRegistration(userData);
            if (ValidationUtils.hasErrors(errors)) {
                ValidationUtils.showValidationErrors(errors, 'registerForm');
                return;
            }

            // Limpiar errores
            ValidationUtils.clearValidationErrors('registerForm');

            // Mostrar loading
            modalComponent.showLoadingModal('Registrando usuario...');

            // Realizar registro
            await authService.register(userData);

            // Ocultar loading
            modalComponent.hideLoadingModal();

            // Mostrar mensaje de éxito
            headerComponent.showMessage('Usuario registrado exitosamente. Inicia sesión para continuar.', 'success');

            // Redirigir a login
            router.navigateTo('login');

        } catch (error) {
            modalComponent.hideLoadingModal();
            console.error('Error en registro:', error);
            
            // Mostrar error específico
            const errorMessage = error.message || 'Error al registrar usuario';
            headerComponent.showMessage(errorMessage, 'danger');
        }
    }

    /**
     * Maneja la inscripción a un curso
     * @param {number} courseId - ID del curso
     */
    async handleEnrollment(courseId) {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                headerComponent.showMessage('Debes iniciar sesión para inscribirte', 'warning');
                router.navigateTo('login');
                return;
            }

            // Mostrar confirmación
            modalComponent.showConfirmModal(
                'Confirmar Inscripción',
                '¿Estás seguro de que quieres inscribirte en este curso?',
                async () => {
                    try {
                        modalComponent.showLoadingModal('Procesando inscripción...');
                        
                        await enrollmentService.createEnrollment(currentUser.id, courseId);
                        
                        modalComponent.hideLoadingModal();
                        headerComponent.showMessage('Inscripción realizada exitosamente', 'success');
                        
                        // Recargar la página actual
                        router.handleRouteChange();
                        
                    } catch (error) {
                        modalComponent.hideLoadingModal();
                        console.error('Error al inscribirse:', error);
                        headerComponent.showMessage(error.message, 'danger');
                    }
                }
            );

        } catch (error) {
            console.error('Error al manejar inscripción:', error);
            headerComponent.showMessage('Error al procesar la inscripción', 'danger');
        }
    }

    /**
     * Maneja la cancelación de una inscripción
     * @param {number} enrollmentId - ID de la inscripción
     */
    async handleCancelEnrollment(enrollmentId) {
        try {
            // Mostrar confirmación
            modalComponent.showConfirmModal(
                'Cancelar Inscripción',
                '¿Estás seguro de que quieres cancelar esta inscripción?',
                async () => {
                    try {
                        modalComponent.showLoadingModal('Cancelando inscripción...');
                        
                        await enrollmentService.deleteEnrollment(enrollmentId);
                        
                        modalComponent.hideLoadingModal();
                        headerComponent.showMessage('Inscripción cancelada exitosamente', 'success');
                        
                        // Recargar la página actual
                        router.handleRouteChange();
                        
                    } catch (error) {
                        modalComponent.hideLoadingModal();
                        console.error('Error al cancelar inscripción:', error);
                        headerComponent.showMessage(error.message, 'danger');
                    }
                }
            );

        } catch (error) {
            console.error('Error al manejar cancelación:', error);
            headerComponent.showMessage('Error al procesar la cancelación', 'danger');
        }
    }

    /**
     * Muestra error de inicialización
     */
    showInitializationError() {
        const mainElement = document.getElementById('main');
        if (mainElement) {
            mainElement.innerHTML = `
                <div class="container">
                    <div class="alert alert-danger">
                        <h2>Error de Inicialización</h2>
                        <p>No se pudo inicializar la aplicación correctamente.</p>
                        <p>Verifica que:</p>
                        <ul>
                            <li>json-server esté ejecutándose en el puerto 3000</li>
                            <li>El archivo db.json esté configurado correctamente</li>
                            <li>Tu navegador soporte JavaScript moderno</li>
                        </ul>
                        <button class="btn btn-primary" onclick="location.reload()">
                            Recargar Página
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Obtiene el estado de inicialización
     * @returns {boolean} - true si está inicializada
     */
    isInitialized() {
        return this.isInitialized;
    }

    /**
     * Obtiene el estado de disponibilidad de la API
     * @returns {boolean} - true si la API está disponible
     */
    isApiAvailable() {
        return this.apiAvailable;
    }
}

// ========================================
// FUNCIONES GLOBALES
// ========================================

/**
 * Función global para inscribirse en un curso
 * @param {number} courseId - ID del curso
 */
function enrollInCourse(courseId) {
    app.handleEnrollment(courseId);
}

/**
 * Función global para cancelar una inscripción
 * @param {number} enrollmentId - ID de la inscripción
 */
function cancelEnrollment(enrollmentId) {
    app.handleCancelEnrollment(enrollmentId);
}

/**
 * Función global para mostrar modal de creación de usuario
 */
function showCreateUserModal() {
    const formContent = `
        <div class="form-group">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" required>
            <div id="nameError" class="error"></div>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <div id="emailError" class="error"></div>
        </div>
        <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <div id="passwordError" class="error"></div>
        </div>
        <div class="form-group">
            <label for="role">Rol:</label>
            <select id="role" name="role" required>
                <option value="visitor">Visitante</option>
                <option value="admin">Administrador</option>
            </select>
            <div id="roleError" class="error"></div>
        </div>
        <div class="form-group">
            <label for="phone">Teléfono:</label>
            <input type="tel" id="phone" name="phone">
            <div id="phoneError" class="error"></div>
        </div>
    `;

    modalComponent.showFormModal('createUserModal', 'Crear Usuario', formContent, async (form) => {
        try {
            const formData = new FormData(form);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role'),
                phone: formData.get('phone') || ''
            };

            await userService.createUser(userData);
            headerComponent.showMessage('Usuario creado exitosamente', 'success');
            
            // Recargar la tabla de usuarios si estamos en esa página
            if (router.currentRoute === 'users') {
                router.handleRouteChange();
            }
        } catch (error) {
            headerComponent.showMessage(error.message, 'danger');
        }
    });
}

/**
 * Función global para mostrar modal de creación de curso
 */
function showCreateCourseModal() {
    const formContent = `
        <div class="form-group">
            <label for="title">Título:</label>
            <input type="text" id="title" name="title" required>
            <div id="titleError" class="error"></div>
        </div>
        <div class="form-group">
            <label for="description">Descripción:</label>
            <textarea id="description" name="description" required></textarea>
            <div id="descriptionError" class="error"></div>
        </div>
        <div class="form-group">
            <label for="startDate">Fecha de Inicio:</label>
            <input type="date" id="startDate" name="startDate" required>
            <div id="startDateError" class="error"></div>
        </div>
        <div class="form-group">
            <label for="duration">Duración:</label>
            <input type="text" id="duration" name="duration" placeholder="ej: 4 semanas" required>
            <div id="durationError" class="error"></div>
        </div>
        <div class="form-group">
            <label for="capacity">Capacidad:</label>
            <input type="number" id="capacity" name="capacity" min="1" max="100" value="20">
            <div id="capacityError" class="error"></div>
        </div>
    `;

    modalComponent.showFormModal('createCourseModal', 'Crear Curso', formContent, async (form) => {
        try {
            const formData = new FormData(form);
            const courseData = {
                title: formData.get('title'),
                description: formData.get('description'),
                startDate: formData.get('startDate'),
                duration: formData.get('duration'),
                capacity: parseInt(formData.get('capacity')) || 20
            };

            await courseService.createCourse(courseData);
            headerComponent.showMessage('Curso creado exitosamente', 'success');
            
            // Recargar la tabla de cursos si estamos en esa página
            if (router.currentRoute === 'courses-admin') {
                router.handleRouteChange();
            }
        } catch (error) {
            headerComponent.showMessage(error.message, 'danger');
        }
    });
}

// Crear instancia global de la aplicación
const app = new App();

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Exportar para uso global
window.App = App;
window.app = app; 