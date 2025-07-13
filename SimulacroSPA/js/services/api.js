// ========================================
// SERVICIO DE API
// ========================================

/**
 * Clase para manejar las peticiones HTTP a la API
 */
class ApiService {
    
    constructor() {
        // URL base de la API (json-server)
        this.baseURL = 'http://localhost:3000';
        
        // Headers por defecto
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Realiza una petición HTTP genérica
     * @param {string} url - URL de la petición
     * @param {Object} options - Opciones de la petición
     * @returns {Promise} - Promise con la respuesta
     */
    async request(url, options = {}) {
        try {
            // Configurar headers
            const headers = {
                ...this.defaultHeaders,
                ...options.headers
            };

            // Configurar opciones de la petición
            const requestOptions = {
                method: options.method || 'GET',
                headers,
                ...options
            };

            // Realizar la petición
            const response = await fetch(`${this.baseURL}${url}`, requestOptions);

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parsear la respuesta JSON
            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error en petición API:', error);
            throw error;
        }
    }

    /**
     * Realiza una petición GET
     * @param {string} url - URL de la petición
     * @param {Object} params - Parámetros de consulta
     * @returns {Promise} - Promise con la respuesta
     */
    async get(url, params = {}) {
        // Construir URL con parámetros
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        
        return this.request(fullUrl, { method: 'GET' });
    }

    /**
     * Realiza una petición POST
     * @param {string} url - URL de la petición
     * @param {Object} data - Datos a enviar
     * @returns {Promise} - Promise con la respuesta
     */
    async post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Realiza una petición PUT
     * @param {string} url - URL de la petición
     * @param {Object} data - Datos a enviar
     * @returns {Promise} - Promise con la respuesta
     */
    async put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Realiza una petición PATCH
     * @param {string} url - URL de la petición
     * @param {Object} data - Datos a enviar
     * @returns {Promise} - Promise con la respuesta
     */
    async patch(url, data = {}) {
        return this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    /**
     * Realiza una petición DELETE
     * @param {string} url - URL de la petición
     * @returns {Promise} - Promise con la respuesta
     */
    async delete(url) {
        return this.request(url, { method: 'DELETE' });
    }

    /**
     * Obtiene todos los elementos de un recurso
     * @param {string} resource - Nombre del recurso
     * @param {Object} params - Parámetros de consulta
     * @returns {Promise} - Promise con la lista de elementos
     */
    async getAll(resource, params = {}) {
        return this.get(`/${resource}`, params);
    }

    /**
     * Obtiene un elemento específico por ID
     * @param {string} resource - Nombre del recurso
     * @param {number|string} id - ID del elemento
     * @returns {Promise} - Promise con el elemento
     */
    async getById(resource, id) {
        return this.get(`/${resource}/${id}`);
    }

    /**
     * Crea un nuevo elemento
     * @param {string} resource - Nombre del recurso
     * @param {Object} data - Datos del elemento
     * @returns {Promise} - Promise con el elemento creado
     */
    async create(resource, data) {
        return this.post(`/${resource}`, data);
    }

    /**
     * Actualiza un elemento existente
     * @param {string} resource - Nombre del recurso
     * @param {number|string} id - ID del elemento
     * @param {Object} data - Datos a actualizar
     * @returns {Promise} - Promise con el elemento actualizado
     */
    async update(resource, id, data) {
        return this.put(`/${resource}/${id}`, data);
    }

    /**
     * Actualiza parcialmente un elemento
     * @param {string} resource - Nombre del recurso
     * @param {number|string} id - ID del elemento
     * @param {Object} data - Datos a actualizar
     * @returns {Promise} - Promise con el elemento actualizado
     */
    async patch(resource, id, data) {
        return this.patch(`/${resource}/${id}`, data);
    }

    /**
     * Elimina un elemento
     * @param {string} resource - Nombre del recurso
     * @param {number|string} id - ID del elemento
     * @returns {Promise} - Promise con la respuesta
     */
    async delete(resource, id) {
        return this.delete(`/${resource}/${id}`);
    }

    /**
     * Busca elementos por criterios específicos
     * @param {string} resource - Nombre del recurso
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise} - Promise con los elementos encontrados
     */
    async search(resource, filters = {}) {
        return this.get(`/${resource}`, filters);
    }

    /**
     * Verifica si la API está disponible
     * @returns {Promise<boolean>} - true si está disponible, false si no
     */
    async isAvailable() {
        try {
            await this.get('/');
            return true;
        } catch (error) {
            console.error('API no disponible:', error);
            return false;
        }
    }
}

// Crear instancia global del servicio de API
const apiService = new ApiService();

// Exportar para uso global
window.ApiService = ApiService;
window.apiService = apiService; 