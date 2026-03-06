import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../services/ServiceProducts';
import './Galletas.css';

function Galletas() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function cargarProductos() {
            const data = await ServiceProducts.getProductos("productos_galletas");
            setProductos(data);
        }
        cargarProductos();
    }, []);

    // Funciones de lógica para filtrar y adaptar data
    function obtenerChocochip() {
        return productos.filter(p => p.subcategoria === "Chocochip Clásicas");
    }

    function obtenerRellenas() {
        return productos.filter(p => p.subcategoria === "Rellenas de Nutella");
    }

    function obtenerAvena() {
        return productos.filter(p => p.subcategoria === "Avena y Pasas");
    }

    function obtenerMantequilla() {
        return productos.filter(p => p.subcategoria === "Mantequilla Suaves");
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
                <h1 className="titulo_pagina">Galletas</h1>
                <p className="subtitulo_pagina">Crujientes, suaves y llenas de sabor.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Chocochip Clásicas" items={adaptarData(obtenerChocochip())} />
                    <ProductCarousel title="Rellenas de Nutella" items={adaptarData(obtenerRellenas())} />
                    <ProductCarousel title="Avena y Pasas" items={adaptarData(obtenerAvena())} />
                    <ProductCarousel title="Mantequilla Suaves" items={adaptarData(obtenerMantequilla())} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default Galletas;
