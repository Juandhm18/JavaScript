// ========================================
// SERVICIO DE CURSOS
// ========================================

/**
 * Clase para manejar las operaciones CRUD de cursos
 */
class CourseService {
    
    constructor() {
        this.resource = 'courses';
    }

    /**
     * Obtiene todos los cursos
     * @param {Object} filters - Filtros opcionales
     * @returns {Promise<Array>} - Promise con la lista de cursos
     */
    async getAllCourses(filters = {}) {
        try {
            const courses = await apiService.getAll(this.resource, filters);
            return courses;
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    }

    /**
     * Obtiene un curso por ID
     * @param {number} id - ID del curso
     * @returns {Promise<Object>} - Promise con el curso
     */
    async getCourseById(id) {
        try {
            const course = await apiService.getById(this.resource, id);
            return course;
        } catch (error) {
            console.error('Error al obtener curso:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo curso
     * @param {Object} courseData - Datos del curso
     * @returns {Promise<Object>} - Promise con el curso creado
     */
    async createCourse(courseData) {
        try {
            // Validar datos del curso
            const errors = ValidationUtils.validateCourse(courseData);
            if (ValidationUtils.hasErrors(errors)) {
                throw new Error('Datos de curso inválidos');
            }

            // Establecer valores por defecto
            const newCourse = {
                ...courseData,
                enrolled: courseData.enrolled || 0,
                capacity: courseData.capacity || 20
            };

            const course = await apiService.create(this.resource, newCourse);
            console.log('Curso creado:', course);
            return course;
        } catch (error) {
            console.error('Error al crear curso:', error);
            throw error;
        }
    }

    /**
     * Actualiza un curso existente
     * @param {number} id - ID del curso
     * @param {Object} courseData - Datos a actualizar
     * @returns {Promise<Object>} - Promise con el curso actualizado
     */
    async updateCourse(id, courseData) {
        try {
            // Obtener curso actual
            const currentCourse = await this.getCourseById(id);
            
            // Validar que la nueva capacidad no sea menor que los inscritos actuales
            if (courseData.capacity && courseData.capacity < currentCourse.enrolled) {
                throw new Error('La capacidad no puede ser menor que el número de estudiantes inscritos');
            }

            const course = await apiService.update(this.resource, id, courseData);
            console.log('Curso actualizado:', course);
            return course;
        } catch (error) {
            console.error('Error al actualizar curso:', error);
            throw error;
        }
    }

    /**
     * Elimina un curso
     * @param {number} id - ID del curso
     * @returns {Promise<boolean>} - Promise con el resultado
     */
    async deleteCourse(id) {
        try {
            // Verificar si el curso tiene inscripciones activas
            const enrollments = await apiService.search('enrollments', { courseId: id });
            if (enrollments.length > 0) {
                throw new Error('No se puede eliminar un curso con estudiantes inscritos');
            }

            await apiService.delete(this.resource, id);
            console.log('Curso eliminado:', id);
            return true;
        } catch (error) {
            console.error('Error al eliminar curso:', error);
            throw error;
        }
    }

    /**
     * Busca cursos por criterios específicos
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Array>} - Promise con los cursos encontrados
     */
    async searchCourses(filters = {}) {
        try {
            const courses = await apiService.search(this.resource, filters);
            return courses;
        } catch (error) {
            console.error('Error al buscar cursos:', error);
            throw error;
        }
    }

    /**
     * Obtiene cursos disponibles (con cupos)
     * @returns {Promise<Array>} - Promise con los cursos disponibles
     */
    async getAvailableCourses() {
        try {
            const allCourses = await this.getAllCourses();
            return allCourses.filter(course => course.enrolled < course.capacity);
        } catch (error) {
            console.error('Error al obtener cursos disponibles:', error);
            throw error;
        }
    }

    /**
     * Obtiene cursos completos (sin cupos)
     * @returns {Promise<Array>} - Promise con los cursos completos
     */
    async getFullCourses() {
        try {
            const allCourses = await this.getAllCourses();
            return allCourses.filter(course => course.enrolled >= course.capacity);
        } catch (error) {
            console.error('Error al obtener cursos completos:', error);
            throw error;
        }
    }

    /**
     * Obtiene cursos próximos a comenzar
     * @param {number} daysAhead - Días hacia adelante para buscar
     * @returns {Promise<Array>} - Promise con los cursos próximos
     */
    async getUpcomingCourses(daysAhead = 30) {
        try {
            const allCourses = await this.getAllCourses();
            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + daysAhead);

            return allCourses.filter(course => {
                const startDate = new Date(course.startDate);
                return startDate >= today && startDate <= futureDate;
            });
        } catch (error) {
            console.error('Error al obtener cursos próximos:', error);
            throw error;
        }
    }

    /**
     * Incrementa el contador de estudiantes inscritos
     * @param {number} courseId - ID del curso
     * @returns {Promise<Object>} - Promise con el curso actualizado
     */
    async incrementEnrollment(courseId) {
        try {
            const course = await this.getCourseById(courseId);
            
            if (course.enrolled >= course.capacity) {
                throw new Error('El curso está completo');
            }

            const updatedCourse = await this.updateCourse(courseId, {
                enrolled: course.enrolled + 1
            });

            console.log(`Inscripción incrementada en curso ${courseId}`);
            return updatedCourse;
        } catch (error) {
            console.error('Error al incrementar inscripción:', error);
            throw error;
        }
    }

    /**
     * Decrementa el contador de estudiantes inscritos
     * @param {number} courseId - ID del curso
     * @returns {Promise<Object>} - Promise con el curso actualizado
     */
    async decrementEnrollment(courseId) {
        try {
            const course = await this.getCourseById(courseId);
            
            if (course.enrolled <= 0) {
                throw new Error('No hay estudiantes inscritos para decrementar');
            }

            const updatedCourse = await this.updateCourse(courseId, {
                enrolled: course.enrolled - 1
            });

            console.log(`Inscripción decrementada en curso ${courseId}`);
            return updatedCourse;
        } catch (error) {
            console.error('Error al decrementar inscripción:', error);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas de cursos
     * @returns {Promise<Object>} - Promise con las estadísticas
     */
    async getCourseStats() {
        try {
            const allCourses = await this.getAllCourses();
            const availableCourses = await this.getAvailableCourses();
            const fullCourses = await this.getFullCourses();
            const upcomingCourses = await this.getUpcomingCourses();

            const totalEnrolled = allCourses.reduce((sum, course) => sum + course.enrolled, 0);
            const totalCapacity = allCourses.reduce((sum, course) => sum + course.capacity, 0);

            return {
                total: allCourses.length,
                available: availableCourses.length,
                full: fullCourses.length,
                upcoming: upcomingCourses.length,
                totalEnrolled,
                totalCapacity,
                enrollmentRate: totalCapacity > 0 ? (totalEnrolled / totalCapacity * 100).toFixed(1) : 0
            };
        } catch (error) {
            console.error('Error al obtener estadísticas de cursos:', error);
            throw error;
        }
    }

    /**
     * Verifica si un curso tiene cupos disponibles
     * @param {number} courseId - ID del curso
     * @returns {Promise<boolean>} - Promise con true si tiene cupos
     */
    async hasAvailableSpots(courseId) {
        try {
            const course = await this.getCourseById(courseId);
            return course.enrolled < course.capacity;
        } catch (error) {
            console.error('Error al verificar cupos disponibles:', error);
            throw error;
        }
    }

    /**
     * Obtiene cursos por título (búsqueda)
     * @param {string} title - Título a buscar
     * @returns {Promise<Array>} - Promise con los cursos encontrados
     */
    async searchByTitle(title) {
        try {
            const allCourses = await this.getAllCourses();
            const searchTerm = title.toLowerCase();
            
            return allCourses.filter(course => 
                course.title.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Error al buscar cursos por título:', error);
            throw error;
        }
    }
}

// Crear instancia global del servicio de cursos
const courseService = new CourseService();

// Exportar para uso global
window.CourseService = CourseService;
window.courseService = courseService; 