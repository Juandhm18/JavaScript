// ========================================
// COMPONENTE SIDEBAR
// ========================================

/**
 * Clase para manejar el sidebar de la aplicación
 */
class SidebarComponent {
    
    constructor() {
        this.sidebarElement = document.getElementById('sidebar');
        this.isOpen = false;
        this.currentSection = null;
    }

    /**
     * Inicializa el componente sidebar
     */
    init() {
        if (!this.sidebarElement) {
            console.error('Elemento sidebar no encontrado');
            return;
        }

        this.render();
        this.bindEvents();
    }

    /**
     * Renderiza el sidebar
     */
    render() {
        if (!authService.isAuthenticated() || !authService.isAdmin()) {
            this.hide();
            return;
        }

        this.sidebarElement.innerHTML = `
            <div class="sidebar-header">
                <h3>Panel de Administración</h3>
                <p>Bienvenido, ${authService.getCurrentUser().name}</p>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li>
                        <a href="#dashboard" class="sidebar-link" data-section="dashboard">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#users" class="sidebar-link" data-section="users">
                            Gestión de Usuarios
                        </a>
                    </li>
                    <li>
                        <a href="#courses" class="sidebar-link" data-section="courses">
                            Gestión de Cursos
                        </a>
                    </li>
                    <li>
                        <a href="#enrollments" class="sidebar-link" data-section="enrollments">
                            Gestión de Inscripciones
                        </a>
                    </li>
                    <li>
                        <a href="#reports" class="sidebar-link" data-section="reports">
                            Reportes
                        </a>
                    </li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <button id="closeSidebarBtn" class="btn btn-secondary">Cerrar</button>
            </div>
        `;
    }

    /**
     * Vincula los eventos del sidebar
     */
    bindEvents() {
        // Evento para cerrar sidebar
        const closeBtn = document.getElementById('closeSidebarBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.toggle();
            });
        }

        // Eventos para enlaces del sidebar
        this.sidebarElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-link')) {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                if (section) {
                    this.navigateToSection(section);
                }
            }
        });

        // Evento para cerrar sidebar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.sidebarElement.contains(e.target) && 
                !e.target.closest('.sidebar-toggle')) {
                this.hide();
            }
        });
    }

    /**
     * Navega a una sección específica
     * @param {string} section - Sección a navegar
     */
    navigateToSection(section) {
        this.currentSection = section;
        this.updateActiveLink(section);
        window.location.hash = section;
        this.hide(); // Cerrar sidebar en móviles
    }

    /**
     * Actualiza el enlace activo en el sidebar
     * @param {string} section - Sección activa
     */
    updateActiveLink(section) {
        const links = this.sidebarElement.querySelectorAll('.sidebar-link');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Muestra el sidebar
     */
    show() {
        if (!authService.isAuthenticated() || !authService.isAdmin()) {
            return;
        }

        this.sidebarElement.classList.add('active');
        this.isOpen = true;
        
        // Ajustar el contenido principal
        const mainElement = document.getElementById('main');
        if (mainElement) {
            mainElement.style.marginLeft = '300px';
        }
    }

    /**
     * Oculta el sidebar
     */
    hide() {
        this.sidebarElement.classList.remove('active');
        this.isOpen = false;
        
        // Restaurar el contenido principal
        const mainElement = document.getElementById('main');
        if (mainElement) {
            mainElement.style.marginLeft = '0';
        }
    }

    /**
     * Alterna la visibilidad del sidebar
     */
    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Actualiza el sidebar cuando cambia el estado de autenticación
     */
    updateAuthState() {
        if (authService.isAuthenticated() && authService.isAdmin()) {
            this.render();
            this.bindEvents();
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Obtiene la sección actual
     * @returns {string|null} - Sección actual
     */
    getCurrentSection() {
        return this.currentSection;
    }

    /**
     * Verifica si el sidebar está abierto
     * @returns {boolean} - true si está abierto
     */
    isOpen() {
        return this.isOpen;
    }

    /**
     * Agrega un botón para abrir el sidebar en el header
     */
    addToggleButton() {
        const headerContent = document.querySelector('.header-content');
        if (headerContent && authService.isAuthenticated() && authService.isAdmin()) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'btn btn-secondary sidebar-toggle';
            toggleBtn.innerHTML = '☰';
            toggleBtn.style.marginRight = '1rem';
            
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });

            // Insertar al inicio del header
            headerContent.insertBefore(toggleBtn, headerContent.firstChild);
        }
    }

    /**
     * Remueve el botón de toggle del sidebar
     */
    removeToggleButton() {
        const toggleBtn = document.querySelector('.sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.remove();
        }
    }
}

// Crear instancia global del componente sidebar
const sidebarComponent = new SidebarComponent();

// Exportar para uso global
window.SidebarComponent = SidebarComponent;
window.sidebarComponent = sidebarComponent; 