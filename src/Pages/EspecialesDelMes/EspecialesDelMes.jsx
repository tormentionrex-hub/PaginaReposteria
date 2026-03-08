import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './EspecialesDelMes.css';

function EspecialesDelMes() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function cargarProductos() {
            const data = await ServiceProducts.getProductos("productos_especialesDelMes");
            setProductos(data);
        }
        cargarProductos();
    }, []);

    // Funciones de lógica para filtrar y adaptar data
    function obtenerFresas() {
        return productos.filter(p => p.subcategoria === "Amantes de las Fresas");
    }

    function obtenerCacao() {
        return productos.filter(p => p.subcategoria === "Fiebre de Cacao");
    }

    function obtenerSaludables() {
        return productos.filter(p => p.subcategoria === "Opciones Saludables");
    }

    function obtenerChef() {
        return productos.filter(p => p.subcategoria === "Selección del Chef");
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
                <h1 className="titulo_pagina">Especiales del Mes</h1>
                <p className="subtitulo_pagina">Descubre las novedades que tenemos preparadas para este mes.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Amantes de las Fresas" items={adaptarData(obtenerFresas())} />
                    <ProductCarousel title="Fiebre de Cacao" items={adaptarData(obtenerCacao())} />
                    <ProductCarousel title="Opciones Saludables" items={adaptarData(obtenerSaludables())} />
                    <ProductCarousel title="Selección del Chef" items={adaptarData(obtenerChef())} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default EspecialesDelMes;
