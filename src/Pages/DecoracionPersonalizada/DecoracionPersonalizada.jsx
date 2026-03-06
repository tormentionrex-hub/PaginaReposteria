import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './DecoracionPersonalizada.css';

function DecoracionPersonalizada() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function cargarProductos() {
            const data = await ServiceProducts.getProductos("productos_decoracionPersonalizada");
            setProductos(data);
        }
        cargarProductos();
    }, []);

    // Funciones de lógica para filtrar y adaptar data
    function obtenerInfantiles() {
        return productos.filter(p => p.subcategoria === "Fiestas Infantiles");
    }

    function obtenerBodas() {
        return productos.filter(p => p.subcategoria === "Bodas y Aniversarios");
    }

    function obtenerMinimalistas() {
        return productos.filter(p => p.subcategoria === "Minimalistas");
    }

    function obtenerTematicas() {
        return productos.filter(p => p.subcategoria === "Temáticas Exclusivas");
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
                <h1 className="titulo_pagina">Decoración Personalizada</h1>
                <p className="subtitulo_pagina">Hacemos realidad tus diseños favoritos.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Fiestas Infantiles" items={adaptarData(obtenerInfantiles())} />
                    <ProductCarousel title="Bodas y Aniversarios" items={adaptarData(obtenerBodas())} />
                    <ProductCarousel title="Minimalistas" items={adaptarData(obtenerMinimalistas())} />
                    <ProductCarousel title="Temáticas Exclusivas" items={adaptarData(obtenerTematicas())} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default DecoracionPersonalizada;
