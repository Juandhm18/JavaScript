// ========================================
// SERVICIO DE INSCRIPCIONES
// ========================================

/**
 * Clase para manejar las inscripciones a cursos
 */
class EnrollmentService {
    
    constructor() {
        this.resource = 'enrollments';
    }

    /**
     * Obtiene todas las inscripciones
     * @param {Object} filters - Filtros opcionales
     * @returns {Promise<Array>} - Promise con la lista de inscripciones
     */
    async getAllEnrollments(filters = {}) {
        try {
            const enrollments = await apiService.getAll(this.resource, filters);
            return enrollments;
        } catch (error) {
            console.error('Error al obtener inscripciones:', error);
            throw error;
        }
    }

    /**
     * Obtiene una inscripción por ID
     * @param {number} id - ID de la inscripción
     * @returns {Promise<Object>} - Promise con la inscripción
     */
    async getEnrollmentById(id) {
        try {
            const enrollment = await apiService.getById(this.resource, id);
            return enrollment;
        } catch (error) {
            console.error('Error al obtener inscripción:', error);
            throw error;
        }
    }

    /**
     * Crea una nueva inscripción
     * @param {number} userId - ID del usuario
     * @param {number} courseId - ID del curso
     * @returns {Promise<Object>} - Promise con la inscripción creada
     */
    async createEnrollment(userId, courseId) {
        try {
            // Verificar que el usuario existe
            const user = await userService.getUserById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar que el curso existe
            const course = await courseService.getCourseById(courseId);
            if (!course) {
                throw new Error('Curso no encontrado');
            }

            // Verificar que el curso tiene cupos disponibles
            if (!(await courseService.hasAvailableSpots(courseId))) {
                throw new Error('El curso está completo');
            }

            // Verificar que el usuario no esté ya inscrito en este curso
            const existingEnrollment = await this.getEnrollmentByUserAndCourse(userId, courseId);
            if (existingEnrollment) {
                throw new Error('El usuario ya está inscrito en este curso');
            }

            // Crear la inscripción
            const enrollmentData = {
                userId: userId,
                courseId: courseId,
                enrollmentDate: new Date().toISOString(),
                status: 'active'
            };

            const enrollment = await apiService.create(this.resource, enrollmentData);

            // Incrementar el contador de estudiantes en el curso
            await courseService.incrementEnrollment(courseId);

            console.log('Inscripción creada:', enrollment);
            return enrollment;
        } catch (error) {
            console.error('Error al crear inscripción:', error);
            throw error;
        }
    }

    /**
     * Elimina una inscripción
     * @param {number} id - ID de la inscripción
     * @returns {Promise<boolean>} - Promise con el resultado
     */
    async deleteEnrollment(id) {
        try {
            // Obtener la inscripción antes de eliminarla
            const enrollment = await this.getEnrollmentById(id);
            if (!enrollment) {
                throw new Error('Inscripción no encontrada');
            }

            // Eliminar la inscripción
            await apiService.delete(this.resource, id);

            // Decrementar el contador de estudiantes en el curso
            await courseService.decrementEnrollment(enrollment.courseId);

            console.log('Inscripción eliminada:', id);
            return true;
        } catch (error) {
            console.error('Error al eliminar inscripción:', error);
            throw error;
        }
    }

    /**
     * Obtiene inscripciones por usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Promise con las inscripciones del usuario
     */
    async getEnrollmentsByUser(userId) {
        try {
            const enrollments = await apiService.search(this.resource, { userId });
            return enrollments;
        } catch (error) {
            console.error('Error al obtener inscripciones por usuario:', error);
            throw error;
        }
    }

    /**
     * Obtiene inscripciones por curso
     * @param {number} courseId - ID del curso
     * @returns {Promise<Array>} - Promise con las inscripciones del curso
     */
    async getEnrollmentsByCourse(courseId) {
        try {
            const enrollments = await apiService.search(this.resource, { courseId });
            return enrollments;
        } catch (error) {
            console.error('Error al obtener inscripciones por curso:', error);
            throw error;
        }
    }

    /**
     * Obtiene una inscripción específica por usuario y curso
     * @param {number} userId - ID del usuario
     * @param {number} courseId - ID del curso
     * @returns {Promise<Object|null>} - Promise con la inscripción o null
     */
    async getEnrollmentByUserAndCourse(userId, courseId) {
        try {
            const enrollments = await apiService.search(this.resource, { 
                userId: userId, 
                courseId: courseId 
            });
            return enrollments.length > 0 ? enrollments[0] : null;
        } catch (error) {
            console.error('Error al obtener inscripción por usuario y curso:', error);
            throw error;
        }
    }

    /**
     * Obtiene cursos inscritos de un usuario con detalles
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Promise con los cursos inscritos
     */
    async getUserEnrolledCourses(userId) {
        try {
            const enrollments = await this.getEnrollmentsByUser(userId);
            const enrolledCourses = [];

            for (const enrollment of enrollments) {
                try {
                    const course = await courseService.getCourseById(enrollment.courseId);
                    if (course) {
                        enrolledCourses.push({
                            ...course,
                            enrollmentId: enrollment.id,
                            enrollmentDate: enrollment.enrollmentDate
                        });
                    }
                } catch (error) {
                    console.error(`Error al obtener curso ${enrollment.courseId}:`, error);
                }
            }

            return enrolledCourses;
        } catch (error) {
            console.error('Error al obtener cursos inscritos del usuario:', error);
            throw error;
        }
    }

    /**
     * Obtiene estudiantes inscritos en un curso con detalles
     * @param {number} courseId - ID del curso
     * @returns {Promise<Array>} - Promise con los estudiantes inscritos
     */
    async getCourseEnrolledStudents(courseId) {
        try {
            const enrollments = await this.getEnrollmentsByCourse(courseId);
            const enrolledStudents = [];

            for (const enrollment of enrollments) {
                try {
                    const user = await userService.getUserById(enrollment.userId);
                    if (user) {
                        enrolledStudents.push({
                            ...user,
                            enrollmentId: enrollment.id,
                            enrollmentDate: enrollment.enrollmentDate
                        });
                    }
                } catch (error) {
                    console.error(`Error al obtener usuario ${enrollment.userId}:`, error);
                }
            }

            return enrolledStudents;
        } catch (error) {
            console.error('Error al obtener estudiantes inscritos en el curso:', error);
            throw error;
        }
    }

    /**
     * Verifica si un usuario está inscrito en un curso
     * @param {number} userId - ID del usuario
     * @param {number} courseId - ID del curso
     * @returns {Promise<boolean>} - Promise con true si está inscrito
     */
    async isUserEnrolled(userId, courseId) {
        try {
            const enrollment = await this.getEnrollmentByUserAndCourse(userId, courseId);
            return enrollment !== null;
        } catch (error) {
            console.error('Error al verificar inscripción:', error);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas de inscripciones
     * @returns {Promise<Object>} - Promise con las estadísticas
     */
    async getEnrollmentStats() {
        try {
            const allEnrollments = await this.getAllEnrollments();
            const allCourses = await courseService.getAllCourses();
            const allUsers = await userService.getAllUsers();

            // Inscripciones por curso
            const enrollmentsByCourse = {};
            for (const course of allCourses) {
                const courseEnrollments = await this.getEnrollmentsByCourse(course.id);
                enrollmentsByCourse[course.id] = courseEnrollments.length;
            }

            // Inscripciones por usuario
            const enrollmentsByUser = {};
            for (const user of allUsers) {
                const userEnrollments = await this.getEnrollmentsByUser(user.id);
                enrollmentsByUser[user.id] = userEnrollments.length;
            }

            return {
                total: allEnrollments.length,
                byCourse: enrollmentsByCourse,
                byUser: enrollmentsByUser,
                averagePerCourse: allCourses.length > 0 ? (allEnrollments.length / allCourses.length).toFixed(1) : 0,
                averagePerUser: allUsers.length > 0 ? (allEnrollments.length / allUsers.length).toFixed(1) : 0
            };
        } catch (error) {
            console.error('Error al obtener estadísticas de inscripciones:', error);
            throw error;
        }
    }

    /**
     * Cancela la inscripción de un usuario a un curso
     * @param {number} userId - ID del usuario
     * @param {number} courseId - ID del curso
     * @returns {Promise<boolean>} - Promise con el resultado
     */
    async cancelEnrollment(userId, courseId) {
        try {
            const enrollment = await this.getEnrollmentByUserAndCourse(userId, courseId);
            if (!enrollment) {
                throw new Error('Inscripción no encontrada');
            }

            return await this.deleteEnrollment(enrollment.id);
        } catch (error) {
            console.error('Error al cancelar inscripción:', error);
            throw error;
        }
    }
}

// Crear instancia global del servicio de inscripciones
const enrollmentService = new EnrollmentService();

// Exportar para uso global
window.EnrollmentService = EnrollmentService;
window.enrollmentService = enrollmentService; 