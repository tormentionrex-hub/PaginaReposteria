import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './CupcakesFestivos.css';

function CupcakesFestivos() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function cargarProductos() {
            const data = await ServiceProducts.getProductos("productos_cupcakesFestivos");
            setProductos(data);
        }
        cargarProductos();
    }, []);

    // Funciones de lógica para filtrar y adaptar data
    function obtenerVainilla() {
        return productos.filter(p => p.subcategoria === "Vainilla Clásica");
    }

    function obtenerChocolate() {
        return productos.filter(p => p.subcategoria === "Chocolate Extremo");
    }

    function obtenerRedVelvet() {
        return productos.filter(p => p.subcategoria === "Nuestros Red Velvet");
    }

    function obtenerArcoiris() {
        return productos.filter(p => p.subcategoria === "Arcoíris Infantiles");
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
                <h1 className="titulo_pagina">Cupcakes Festivos</h1>
                <p className="subtitulo_pagina">Perfectos para alegrar cualquier celebración.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Vainilla Clásica" items={adaptarData(obtenerVainilla())} />
                    <ProductCarousel title="Chocolate Extremo" items={adaptarData(obtenerChocolate())} />
                    <ProductCarousel title="Nuestros Red Velvet" items={adaptarData(obtenerRedVelvet())} />
                    <ProductCarousel title="Arcoíris Infantiles" items={adaptarData(obtenerArcoiris())} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default CupcakesFestivos;
