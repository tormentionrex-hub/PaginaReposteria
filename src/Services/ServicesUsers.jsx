import axios from 'axios';

const URL_API = "http://localhost:3001/usuarios";

const ServicesUsers = {
    // Obtener todos los usuarios (para validar login o ver perfiles)
    getUsers: async () => {
        try {
            const response = await axios.get(URL_API);
            return response.data;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            return [];
        }
    },

    // Registrar un nuevo usuario (POST)
    postUser: async (usuario) => {
        try {
            const response = await axios.post(URL_API, usuario);
            return response.data;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    },

    // Actualizar datos del usuario (PATCH)
    patchUser: async (id, data) => {
        try {
            const response = await axios.patch(`${URL_API}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            throw error;
        }
    },

    // Eliminar un usuario (DELETE)
    deleteUser: async (id) => {
        try {
            const response = await axios.delete(`${URL_API}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            throw error;
        }
    }
};

export default ServicesUsers;
