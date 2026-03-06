import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './TartasDeFresa.css';

function TartasDeFresa() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function cargarProductos() {
            const data = await ServiceProducts.getProductos("productos_tartasDeFresa");
            setProductos(data);
        }
        cargarProductos();
    }, []);

    // Funciones de lógica para filtrar y adaptar data
    function obtenerMiniTartas() {
        return productos.filter(p => p.subcategoria === "Mini Tartas Individuales");
    }

    function obtenerFamiliares() {
        return productos.filter(p => p.subcategoria === "Tartas Familiares");
    }

    function obtenerVeganas() {
        return productos.filter(p => p.subcategoria === "Opciones Veganas");
    }

    function obtenerCacao() {
        return productos.filter(p => p.subcategoria === "Tartaletas con Cacao");
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
                <h1 className="titulo_pagina">Tartas de Fresa</h1>
                <p className="subtitulo_pagina">Las tartas más frescas y deliciosas.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Mini Tartas Individuales" items={adaptarData(obtenerMiniTartas())} />
                    <ProductCarousel title="Tartas Familiares" items={adaptarData(obtenerFamiliares())} />
                    <ProductCarousel title="Opciones Veganas" items={adaptarData(obtenerVeganas())} />
                    <ProductCarousel title="Tartaletas con Cacao" items={adaptarData(obtenerCacao())} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default TartasDeFresa;
