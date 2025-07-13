// ========================================
// COMPONENTE MODAL
// ========================================

/**
 * Clase para manejar modales de la aplicación
 */
class ModalComponent {
    
    constructor() {
        this.modalElement = null;
        this.isOpen = false;
        this.currentModalId = null;
    }

    /**
     * Crea un modal dinámicamente
     * @param {string} id - ID del modal
     * @param {string} title - Título del modal
     * @param {string} content - Contenido del modal
     * @param {Object} options - Opciones adicionales
     * @returns {HTMLElement} - Elemento del modal creado
     */
    createModal(id, title, content, options = {}) {
        // Remover modal existente si existe
        this.removeModal(id);

        // Crear elemento del modal
        this.modalElement = document.createElement('div');
        this.modalElement.id = id;
        this.modalElement.className = 'modal';
        
        // Configurar contenido del modal
        this.modalElement.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" id="closeModalBtn">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${options.showFooter !== false ? `
                    <div class="modal-footer">
                        ${options.footerContent || `
                            <button class="btn btn-secondary" id="cancelModalBtn">Cancelar</button>
                            <button class="btn btn-primary" id="confirmModalBtn">Confirmar</button>
                        `}
                    </div>
                ` : ''}
            </div>
        `;

        // Agregar al DOM
        document.body.appendChild(this.modalElement);
        
        // Configurar eventos
        this.bindModalEvents(id, options);
        
        return this.modalElement;
    }

    /**
     * Vincula los eventos del modal
     * @param {string} id - ID del modal
     * @param {Object} options - Opciones del modal
     */
    bindModalEvents(id, options) {
        const modal = document.getElementById(id);
        if (!modal) return;

        // Evento para cerrar con el botón X
        const closeBtn = modal.querySelector('#closeModalBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal(id);
            });
        }

        // Evento para cancelar
        const cancelBtn = modal.querySelector('#cancelModalBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModal(id);
                if (options.onCancel) {
                    options.onCancel();
                }
            });
        }

        // Evento para confirmar
        const confirmBtn = modal.querySelector('#confirmModalBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (options.onConfirm) {
                    options.onConfirm();
                }
                this.closeModal(id);
            });
        }

        // Evento para cerrar al hacer clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(id);
                if (options.onCancel) {
                    options.onCancel();
                }
            }
        });

        // Evento para cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeModal(id);
                if (options.onCancel) {
                    options.onCancel();
                }
            }
        });
    }

    /**
     * Abre un modal
     * @param {string} id - ID del modal
     */
    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'block';
            this.isOpen = true;
            this.currentModalId = id;
            
            // Enfocar el primer input si existe
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    /**
     * Cierra un modal
     * @param {string} id - ID del modal
     */
    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            this.isOpen = false;
            this.currentModalId = null;
        }
    }

    /**
     * Remueve un modal del DOM
     * @param {string} id - ID del modal
     */
    removeModal(id) {
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }
    }

    /**
     * Crea un modal de confirmación
     * @param {string} title - Título del modal
     * @param {string} message - Mensaje de confirmación
     * @param {Function} onConfirm - Función a ejecutar al confirmar
     * @param {Function} onCancel - Función a ejecutar al cancelar
     * @returns {string} - ID del modal creado
     */
    showConfirmModal(title, message, onConfirm, onCancel = null) {
        const modalId = 'confirmModal';
        const content = `<p>${message}</p>`;
        
        this.createModal(modalId, title, content, {
            onConfirm: onConfirm,
            onCancel: onCancel
        });
        
        this.openModal(modalId);
        return modalId;
    }

    /**
     * Crea un modal de formulario
     * @param {string} id - ID del modal
     * @param {string} title - Título del modal
     * @param {string} formContent - Contenido del formulario
     * @param {Function} onSubmit - Función a ejecutar al enviar
     * @param {Function} onCancel - Función a ejecutar al cancelar
     * @returns {string} - ID del modal creado
     */
    showFormModal(id, title, formContent, onSubmit, onCancel = null) {
        const content = `
            <form id="${id}Form">
                ${formContent}
            </form>
        `;
        
        this.createModal(id, title, content, {
            onConfirm: () => {
                const form = document.getElementById(`${id}Form`);
                if (form && onSubmit) {
                    onSubmit(form);
                }
            },
            onCancel: onCancel,
            footerContent: `
                <button class="btn btn-secondary" id="cancelModalBtn">Cancelar</button>
                <button type="submit" class="btn btn-primary" id="confirmModalBtn">Guardar</button>
            `
        });
        
        this.openModal(id);
        return id;
    }

    /**
     * Crea un modal de alerta
     * @param {string} title - Título del modal
     * @param {string} message - Mensaje de la alerta
     * @param {string} type - Tipo de alerta (success, danger, warning, info)
     * @returns {string} - ID del modal creado
     */
    showAlertModal(title, message, type = 'info') {
        const modalId = 'alertModal';
        const content = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
        
        this.createModal(modalId, title, content, {
            footerContent: `
                <button class="btn btn-primary" id="confirmModalBtn">Aceptar</button>
            `
        });
        
        this.openModal(modalId);
        return modalId;
    }

    /**
     * Crea un modal de carga
     * @param {string} message - Mensaje de carga
     * @returns {string} - ID del modal creado
     */
    showLoadingModal(message = 'Cargando...') {
        const modalId = 'loadingModal';
        const content = `
            <div class="loading">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        this.createModal(modalId, 'Cargando', content, {
            showFooter: false
        });
        
        this.openModal(modalId);
        return modalId;
    }

    /**
     * Cierra el modal de carga
     */
    hideLoadingModal() {
        this.closeModal('loadingModal');
    }

    /**
     * Actualiza el contenido de un modal
     * @param {string} id - ID del modal
     * @param {string} content - Nuevo contenido
     */
    updateModalContent(id, content) {
        const modal = document.getElementById(id);
        if (modal) {
            const body = modal.querySelector('.modal-body');
            if (body) {
                body.innerHTML = content;
            }
        }
    }

    /**
     * Verifica si hay un modal abierto
     * @returns {boolean} - true si hay un modal abierto
     */
    isModalOpen() {
        return this.isOpen;
    }

    /**
     * Obtiene el ID del modal actual
     * @returns {string|null} - ID del modal actual
     */
    getCurrentModalId() {
        return this.currentModalId;
    }

    /**
     * Cierra todos los modales
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        this.isOpen = false;
        this.currentModalId = null;
    }
}

// Crear instancia global del componente modal
const modalComponent = new ModalComponent();

// Exportar para uso global
window.ModalComponent = ModalComponent;
window.modalComponent = modalComponent; 