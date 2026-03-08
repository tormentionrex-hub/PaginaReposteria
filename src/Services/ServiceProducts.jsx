import axios from "axios";

// Definimos la URL de nuestra base de datos local (json-server)
const URL_API = "http://localhost:3001";

const categoryMapping = {
    "productos_queques": 1,
    "productos_combosFamiliares": 2,
    "productos_especialesDelMes": 3,
    "productos_cupcakesFestivos": 4,
    "productos_macaronsDulces": 5,
    "productos_decoracionPersonalizada": 6,
    "productos_sabores": 9,
    "productos_galletas": 7,
    "productos_tartasDeFresa": 8
};

const ServiceProducts = {
    // obtener productos por categoria
    getProductos: async (categoria) => {
        try {
            let url = `${URL_API}/productos`;
            const catId = categoryMapping[categoria] || categoria;

            if (catId && typeof catId === 'number') {
                url += `?categoria_id=${catId}`;
            } else if (categoria && categoria !== 'productos') {
                // If it's not a mapping and not 'productos', try the endpoint as requested
                // but for our new structure, we mostly want 'productos'
                url = `${URL_API}/${categoria}`;
            }

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(`Error obteniendo ${categoria}:`, error);
            return [];
        }
    },

    // crear productos
    postProductos: async (objProducto) => {
        try {
            const response = await axios.post(`${URL_API}/productos`, objProducto);
            return response.data;
        } catch (error) {
            console.error(`Error creando producto:`, error);
            throw error;
        }
    },

    // editar un producto existente
    patchProductos: async (objProducto, id) => {
        try {
            const response = await axios.patch(`${URL_API}/productos/${id}`, objProducto);
            return response.data;
        } catch (error) {
            console.error(`Error editando producto con ID ${id}:`, error);
            throw error;
        }
    },

    // eliminar un producto
    deleteProductos: async (id) => {
        try {
            const response = await axios.delete(`${URL_API}/productos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error eliminando producto con ID ${id}:`, error);
            throw error;
        }
    }
};

export default ServiceProducts;
