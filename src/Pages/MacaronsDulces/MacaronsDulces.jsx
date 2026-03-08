import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './MacaronsDulces.css';

function MacaronsDulces() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function cargarProductos() {
            const data = await ServiceProducts.getProductos("productos_macaronsDulces");
            setProductos(data);
        }
        cargarProductos();
    }, []);

    // Funciones de lógica para filtrar y adaptar data
    function obtenerVainilla() {
        return productos.filter(p => p.subcategoria === "Clásicos de Vainilla");
    }

    function obtenerPistacho() {
        return productos.filter(p => p.subcategoria === "Favoritos de Pistacho");
    }

    function obtenerFrutas() {
        return productos.filter(p => p.subcategoria === "Frambuesa y Frutos");
    }

    function obtenerCajas() {
        return productos.filter(p => p.subcategoria === "Cajas de Regalo");
    }

    function adaptarData(arr) {
        return arr.map(item => ({
            ...item,
            image: item.img_Url || "",
            price: `₡${item.precio}`,
            desc: item.detalle
        }));
    }

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <Nav />
            <div className="contenido_pagina">
                <h1 className="titulo_pagina">Macarons Dulces</h1>
                <p className="subtitulo_pagina">Colores y sabores inigualables al estilo francés.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Clásicos de Vainilla" items={adaptarData(obtenerVainilla())} />
                    <ProductCarousel title="Favoritos de Pistacho" items={adaptarData(obtenerPistacho())} />
                    <ProductCarousel title="Frambuesa y Frutos" items={adaptarData(obtenerFrutas())} />
                    <ProductCarousel title="Cajas de Regalo" items={adaptarData(obtenerCajas())} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default MacaronsDulces;
