import axios from "axios";

// Definimos la URL de nuestra base de datos local (json-server)
const URL_API = "http://localhost:3000";

const ServiceProducts = {
    // --------------------------------------------------------------------------
    // OBTENER PRODUCTOS POR CATEGORÍA
    // (Ejemplo: categoria puede ser "productos_queques", "productos_tartasDeFresa")
    // --------------------------------------------------------------------------
    getProductos: async (categoria) => {
        try {
            const response = await axios.get(`${URL_API}/${categoria}`);
            return response.data;
        } catch (error) {
            console.error(`Error obteniendo ${categoria}:`, error);
            return [];
        }
    },

    // --------------------------------------------------------------------------
    // CREAR UN NUEVO PRODUCTO EN UNA CATEGORÍA ESPECÍFICA
    // --------------------------------------------------------------------------
    postProductos: async (categoria, objProducto) => {
        try {
            const response = await axios.post(`${URL_API}/${categoria}`, objProducto);
            return response.data;
        } catch (error) {
            console.error(`Error creando producto en ${categoria}:`, error);
            throw error;
        }
    },

    // --------------------------------------------------------------------------
    // EDITAR UN PRODUCTO EXISTENTE (Usando PATCH obligatoriamente)
    // --------------------------------------------------------------------------
    patchProductos: async (categoria, objProducto, id) => {
        try {
            const response = await axios.patch(`${URL_API}/${categoria}/${id}`, objProducto);
            return response.data;
        } catch (error) {
            console.error(`Error editando producto con ID ${id} en ${categoria}:`, error);
            throw error;
        }
    },

    // --------------------------------------------------------------------------
    // ELIMINAR UN PRODUCTO DE UNA CATEGORÍA ESPECÍFICA
    // --------------------------------------------------------------------------
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
