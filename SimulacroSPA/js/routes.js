// ========================================
// SISTEMA DE RUTAS
// ========================================

/**
 * Clase para manejar el enrutamiento de la aplicación
 */
class Router {
    
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.mainElement = document.getElementById('main');
        this.defaultRoute = 'courses';
    }

    /**
     * Inicializa el router
     */
    init() {
        // Definir rutas
        this.defineRoutes();
        
        // Escuchar cambios en el hash
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
        
        // Manejar ruta inicial
        this.handleRouteChange();
    }

    /**
     * Define todas las rutas de la aplicación
     */
    defineRoutes() {
        // Rutas públicas
        this.addRoute('courses', {
            title: 'Cursos Disponibles',
            template: this.getCoursesTemplate,
            public: true
        });

        this.addRoute('login', {
            title: 'Iniciar Sesión',
            template: this.getLoginTemplate,
            public: true
        });

        this.addRoute('register', {
            title: 'Registrarse',
            template: this.getRegisterTemplate,
            public: true
        });

        // Rutas para visitantes autenticados
        this.addRoute('my-courses', {
            title: 'Mis Cursos',
            template: this.getMyCoursesTemplate,
            requiresAuth: true,
            roles: ['visitor']
        });

        // Rutas para administradores
        this.addRoute('dashboard', {
            title: 'Panel de Administración',
            template: this.getDashboardTemplate,
            requiresAuth: true,
            roles: ['admin']
        });

        this.addRoute('users', {
            title: 'Gestión de Usuarios',
            template: this.getUsersTemplate,
            requiresAuth: true,
            roles: ['admin']
        });

        this.addRoute('courses-admin', {
            title: 'Gestión de Cursos',
            template: this.getCoursesAdminTemplate,
            requiresAuth: true,
            roles: ['admin']
        });

        this.addRoute('enrollments', {
            title: 'Gestión de Inscripciones',
            template: this.getEnrollmentsTemplate,
            requiresAuth: true,
            roles: ['admin']
        });

        this.addRoute('reports', {
            title: 'Reportes',
            template: this.getReportsTemplate,
            requiresAuth: true,
            roles: ['admin']
        });
    }

    /**
     * Agrega una ruta al router
     * @param {string} path - Ruta de la URL
     * @param {Object} config - Configuración de la ruta
     */
    addRoute(path, config) {
        this.routes.set(path, config);
    }

    /**
     * Maneja el cambio de ruta
     */
    handleRouteChange() {
        const hash = window.location.hash.substring(1) || this.defaultRoute;
        const route = this.routes.get(hash);

        if (!route) {
            // Ruta no encontrada, redirigir a cursos
            this.navigateTo('courses');
            return;
        }

        // Verificar autenticación
        if (route.requiresAuth && !authService.isAuthenticated()) {
            this.navigateTo('login');
            return;
        }

        // Verificar roles
        if (route.roles && !route.roles.includes(authService.getCurrentUser()?.role)) {
            this.navigateTo('courses');
            return;
        }

        // Cargar la ruta
        this.loadRoute(hash, route);
    }

    /**
     * Carga una ruta específica
     * @param {string} path - Ruta a cargar
     * @param {Object} route - Configuración de la ruta
     */
    async loadRoute(path, route) {
        try {
            this.currentRoute = path;
            
            // Mostrar loading
            this.showLoading();
            
            // Actualizar título
            document.title = `${route.title} - Sistema Académico`;
            
            // Renderizar contenido
            const content = await route.template();
            this.mainElement.innerHTML = content;
            
            // Actualizar componentes
            this.updateComponents();
            
            // Ocultar loading
            this.hideLoading();
            
        } catch (error) {
            console.error('Error al cargar ruta:', error);
            this.showError('Error al cargar la página');
        }
    }

    /**
     * Navega a una ruta específica
     * @param {string} path - Ruta de destino
     */
    navigateTo(path) {
        window.location.hash = path;
    }

    /**
     * Muestra el estado de carga
     */
    showLoading() {
        if (this.mainElement) {
            this.mainElement.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Cargando...</p>
                </div>
            `;
        }
    }

    /**
     * Oculta el estado de carga
     */
    hideLoading() {
        // El contenido ya se cargó, no necesitamos hacer nada
    }

    /**
     * Muestra un error
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        if (this.mainElement) {
            this.mainElement.innerHTML = `
                <div class="alert alert-danger">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="router.navigateTo('courses')">
                        Volver a Cursos
                    </button>
                </div>
            `;
        }
    }

    /**
     * Actualiza los componentes después de cargar una ruta
     */
    updateComponents() {
        // Actualizar header y sidebar
        headerComponent.updateAuthState();
        sidebarComponent.updateAuthState();
        
        // Agregar botón de toggle para sidebar en móviles
        if (authService.isAuthenticated() && authService.isAdmin()) {
            sidebarComponent.addToggleButton();
        }
    }

    // ========================================
    // TEMPLATES DE RUTAS
    // ========================================

    /**
     * Template para la página de cursos
     */
    async getCoursesTemplate() {
        try {
            const courses = await courseService.getAvailableCourses();
            
            return `
                <div class="container">
                    <h1>Cursos Disponibles</h1>
                    <div class="grid grid-3">
                        ${courses.map(course => `
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title">${course.title}</h3>
                                </div>
                                <p>${course.description}</p>
                                <div class="course-info">
                                    <p><strong>Inicio:</strong> ${course.startDate}</p>
                                    <p><strong>Duración:</strong> ${course.duration}</p>
                                    <p><strong>Cupos:</strong> ${course.enrolled}/${course.capacity}</p>
                                </div>
                                ${authService.isAuthenticated() && authService.isVisitor() ? `
                                    <button class="btn btn-primary" onclick="enrollInCourse(${course.id})">
                                        Inscribirse
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error al cargar cursos:', error);
            return '<p>Error al cargar los cursos</p>';
        }
    }

    /**
     * Template para la página de login
     */
    getLoginTemplate() {
        return `
            <div class="form-container">
                <h1>Iniciar Sesión</h1>
                <form id="loginForm">
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
                        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                    </div>
                </form>
                <p>¿No tienes cuenta? <a href="#register">Regístrate aquí</a></p>
            </div>
        `;
    }

    /**
     * Template para la página de registro
     */
    getRegisterTemplate() {
        return `
            <div class="form-container">
                <h1>Registrarse</h1>
                <form id="registerForm">
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
                        <label for="phone">Teléfono:</label>
                        <input type="tel" id="phone" name="phone">
                        <div id="phoneError" class="error"></div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary">Registrarse</button>
                    </div>
                </form>
                <p>¿Ya tienes cuenta? <a href="#login">Inicia sesión aquí</a></p>
            </div>
        `;
    }

    /**
     * Template para mis cursos (visitantes)
     */
    async getMyCoursesTemplate() {
        try {
            const currentUser = authService.getCurrentUser();
            const enrolledCourses = await enrollmentService.getUserEnrolledCourses(currentUser.id);
            
            return `
                <div class="container">
                    <h1>Mis Cursos</h1>
                    ${enrolledCourses.length > 0 ? `
                        <div class="grid grid-3">
                            ${enrolledCourses.map(course => `
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">${course.title}</h3>
                                    </div>
                                    <p>${course.description}</p>
                                    <div class="course-info">
                                        <p><strong>Inicio:</strong> ${course.startDate}</p>
                                        <p><strong>Duración:</strong> ${course.duration}</p>
                                        <p><strong>Fecha de inscripción:</strong> ${new Date(course.enrollmentDate).toLocaleDateString()}</p>
                                    </div>
                                    <button class="btn btn-danger" onclick="cancelEnrollment(${course.enrollmentId})">
                                        Cancelar Inscripción
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p>No estás inscrito en ningún curso.</p>
                        <a href="#courses" class="btn btn-primary">Ver Cursos Disponibles</a>
                    `}
                </div>
            `;
        } catch (error) {
            console.error('Error al cargar mis cursos:', error);
            return '<p>Error al cargar tus cursos</p>';
        }
    }

    /**
     * Template para el dashboard de administración
     */
    async getDashboardTemplate() {
        try {
            const userStats = await userService.getUserStats();
            const courseStats = await courseService.getCourseStats();
            const enrollmentStats = await enrollmentService.getEnrollmentStats();
            
            return `
                <div class="container">
                    <h1>Panel de Administración</h1>
                    <div class="grid grid-3">
                        <div class="card">
                            <h3>Usuarios</h3>
                            <p>Total: ${userStats.total}</p>
                            <p>Administradores: ${userStats.admins}</p>
                            <p>Visitantes: ${userStats.visitors}</p>
                        </div>
                        <div class="card">
                            <h3>Cursos</h3>
                            <p>Total: ${courseStats.total}</p>
                            <p>Disponibles: ${courseStats.available}</p>
                            <p>Completos: ${courseStats.full}</p>
                        </div>
                        <div class="card">
                            <h3>Inscripciones</h3>
                            <p>Total: ${enrollmentStats.total}</p>
                            <p>Promedio por curso: ${enrollmentStats.averagePerCourse}</p>
                            <p>Promedio por usuario: ${enrollmentStats.averagePerUser}</p>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            return '<p>Error al cargar el dashboard</p>';
        }
    }

    /**
     * Template para gestión de usuarios
     */
    getUsersTemplate() {
        return `
            <div class="container">
                <h1>Gestión de Usuarios</h1>
                <button class="btn btn-primary" onclick="showCreateUserModal()">
                    Crear Usuario
                </button>
                <div id="usersTable" class="table-container mt-3">
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Cargando usuarios...</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Template para gestión de cursos
     */
    getCoursesAdminTemplate() {
        return `
            <div class="container">
                <h1>Gestión de Cursos</h1>
                <button class="btn btn-primary" onclick="showCreateCourseModal()">
                    Crear Curso
                </button>
                <div id="coursesTable" class="table-container mt-3">
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Cargando cursos...</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Template para gestión de inscripciones
     */
    getEnrollmentsTemplate() {
        return `
            <div class="container">
                <h1>Gestión de Inscripciones</h1>
                <div id="enrollmentsTable" class="table-container mt-3">
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Cargando inscripciones...</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Template para reportes
     */
    getReportsTemplate() {
        return `
            <div class="container">
                <h1>Reportes</h1>
                <div class="grid grid-2">
                    <div class="card">
                        <h3>Reporte de Usuarios</h3>
                        <button class="btn btn-primary" onclick="generateUserReport()">
                            Generar Reporte
                        </button>
                    </div>
                    <div class="card">
                        <h3>Reporte de Cursos</h3>
                        <button class="btn btn-primary" onclick="generateCourseReport()">
                            Generar Reporte
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Crear instancia global del router
const router = new Router();

// Exportar para uso global
window.Router = Router;
window.router = router; 