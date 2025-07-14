class HeaderComponent {
    constructor(){
        this.headerElement = document.getElementById('header');
        this.navElement = document.getElementById('nav');
        this.currentUser = null;
    }

    /**
     * Inicializa el componente header
     */
    init() {
        this.currentUser = authService.getCurrentUser();
        this.render();
        this.bindEvents();
    }

    /**
     * Renderiza el header según el estado de autenticación
     */
    render() {
        if (!this.headerElement || !this.navElement) {
            console.error('Elementos del header no encontrados');
            return;
        }

        if (this.currentUser) {
            this.renderAuthenticatedHeader();
        } else {
            this.renderPublicHeader();
        }
    }

    /**
     * Renderiza el header para usuarios autenticados
     */
    renderAuthenticatedHeader() {
        const userRole = this.currentUser.role;
        const userName = this.currentUser.name;

        this.navElement.innerHTML = `
            <div class="flex flex-between">
                <div class="flex">
                    ${userRole === 'admin' ? `
                        <a href="#dashboard" class="nav-link">Panel de Administración</a>
                        <a href="#users" class="nav-link">Usuarios</a>
                        <a href="#courses" class="nav-link">Cursos</a>
                        <a href="#enrollments" class="nav-link">Inscripciones</a>
                    ` : `
                        <a href="#courses" class="nav-link">Cursos Disponibles</a>
                        <a href="#my-courses" class="nav-link">Mis Cursos</a>
                    `}
                </div>
                <div class="flex">
                    <span class="user-info">Bienvenido, ${userName}</span>
                    <button id="logoutBtn" class="btn btn-secondary">Cerrar Sesión</button>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza el header para usuarios públicos
     */
    renderPublicHeader() {
        this.navElement.innerHTML = `
            <div class="flex flex-between">
                <div class="flex">
                    <a href="#courses" class="nav-link">Cursos Disponibles</a>
                </div>
                <div class="flex">
                    <a href="#login" class="nav-link">Iniciar Sesión</a>
                    <a href="#register" class="nav-link">Registrarse</a>
                </div>
            </div>
        `;
    }

    /**
     * Vincula los eventos del header
     */
    bindEvents() {
        // Evento para cerrar sesión
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Eventos para enlaces de navegación
        this.navElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href) {
                    // Navegar a la ruta
                    window.location.hash = href.substring(1);
                }
            }
        });
    }

    /**
     * Maneja el cierre de sesión
     */
    handleLogout() {
        try {
            authService.logout();
            this.currentUser = null;
            this.render();
            
            // Redirigir a la página principal
            window.location.hash = 'courses';
            
            // Mostrar mensaje de éxito
            this.showMessage('Sesión cerrada exitosamente', 'success');
            
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            this.showMessage('Error al cerrar sesión', 'danger');
        }
    }

    /**
     * Actualiza el header cuando cambia el estado de autenticación
     */
    updateAuthState() {
        this.currentUser = authService.getCurrentUser();
        this.render();
        this.bindEvents();
    }

    /**
     * Muestra un mensaje en el header
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de mensaje (success, danger, warning, info)
     */
    showMessage(message, type = 'info') {
        // Crear elemento de mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${type}`;
        messageElement.textContent = message;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '80px';
        messageElement.style.right = '20px';
        messageElement.style.zIndex = '1000';
        messageElement.style.minWidth = '300px';

        // Agregar al DOM
        document.body.appendChild(messageElement);

        // Remover después de 3 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    /**
     * Obtiene el usuario actual
     * @returns {Object|null} - Usuario actual o null
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verifica si el usuario actual es administrador
     * @returns {boolean} - true si es admin
     */
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    /**
     * Verifica si el usuario actual es visitante
     * @returns {boolean} - true si es visitante
     */
    isVisitor() {
        return this.currentUser && this.currentUser.role === 'visitor';
    }

    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean} - true si está autenticado
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Crear instancia global del componente header
const headerComponent = new HeaderComponent();

// Exportar para uso global
window.HeaderComponent = HeaderComponent;
window.headerComponent = headerComponent; 