import axios from "axios";

// Definimos la URL de nuestra base de datos local (json-server)
const URL_API = "http://localhost:3001";

const ServiceProducts = {
    // obtener productos por categoria
    getProductos: async (categoria) => {
        try {
            const response = await axios.get(`${URL_API}/${categoria}`);
            return response.data;
        } catch (error) {
            console.error(`Error obteniendo ${categoria}:`, error);
            return [];
        }
    },

     // crear productos en una categoria especifica
    postProductos: async (categoria, objProducto) => {
        try {
            const response = await axios.post(`${URL_API}/${categoria}`, objProducto);
            return response.data;
        } catch (error) {
            console.error(`Error creando producto en ${categoria}:`, error);
            throw error;
        }
    },

    // editar un producto existente
    patchProductos: async (categoria, objProducto, id) => {
        try {
            const response = await axios.patch(`${URL_API}/${categoria}/${id}`, objProducto);
            return response.data;
        } catch (error) {
            console.error(`Error editando producto con ID ${id} en ${categoria}:`, error);
            throw error;
        }
    },

    // eliminar un producto de una categoria especifica
    deleteProductos: async (categoria, id) => {
        try {
            const response = await axios.delete(`${URL_API}/${categoria}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error eliminando producto con ID ${id} en ${categoria}:`, error);
            throw error;
        }
    }
};

export default ServiceProducts;
