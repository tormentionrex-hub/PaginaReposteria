import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './Queques.css';

function Queques() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function cargarProductos() {
            const data = await ServiceProducts.getProductos("productos_queques");
            setProductos(data);
        }
        cargarProductos();
    }, []);

    // Funciones de lógica para filtrar y adaptar data
    function obtenerClasicos() {
        return productos.filter(p => p.subcategoria === "Nuestros Clásicos");
    }

    function obtenerEspeciales() {
        return productos.filter(p => p.subcategoria === "Especiales para Ti");
    }

    function obtenerPremium() {
        return productos.filter(p => p.subcategoria === "Línea Premium (Fondant)");
    }

    function obtenerTemporada() {
        return productos.filter(p => p.subcategoria === "De Temporada");
    }

    function adaptarData(arr) {
        return arr.map(item => ({
            name: item.producto,
            desc: item.detalle,
            price: item.precio,
            image: item.img || `https://via.placeholder.com/280x200/ffe4eb/b55c70?text=${encodeURIComponent(item.producto)}`
        }));
    }

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <Nav />
            <div className="contenido_pagina">
                <h1 className="titulo_pagina">Queques</h1>
                <p className="subtitulo_pagina">Explora nuestra deliciosa variedad de queques.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Nuestros Clásicos" items={adaptarData(obtenerClasicos())} />
                    <ProductCarousel title="Especiales para Ti" items={adaptarData(obtenerEspeciales())} />
                    <ProductCarousel title="Línea Premium (Fondant)" items={adaptarData(obtenerPremium())} />
                    <ProductCarousel title="De Temporada" items={adaptarData(obtenerTemporada())} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default Queques;
