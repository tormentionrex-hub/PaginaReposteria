import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './CombosFamiliares.css';

function CombosFamiliares() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function cargarProductos() {
            const data = await ServiceProducts.getProductos("productos_combosFamiliares");
            setProductos(data);
        }
        cargarProductos();
    }, []);

    // Funciones de lógica para filtrar y adaptar data
    function obtenerDesayunos() {
        return productos.filter(p => p.subcategoria === "Para Desayunos");
    }

    function obtenerFiestas() {
        return productos.filter(p => p.subcategoria === "Para Fiestas");
    }

    function obtenerCumpleaños() {
        return productos.filter(p => p.subcategoria === "Especial de Cumpleaños");
    }

    function obtenerMegaCombos() {
        return productos.filter(p => p.subcategoria === "Nuestros Mega Combos");
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
                <h1 className="titulo_pagina">Combos Familiares</h1>
                <p className="subtitulo_pagina">Disfruta nuestros combos perfectos para toda la familia.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Para Desayunos" items={adaptarData(obtenerDesayunos())} />
                    <ProductCarousel title="Para Fiestas" items={adaptarData(obtenerFiestas())} />
                    <ProductCarousel title="Especial de Cumpleaños" items={adaptarData(obtenerCumpleaños())} />
                    <ProductCarousel title="Nuestros Mega Combos" items={adaptarData(obtenerMegaCombos())} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default CombosFamiliares;
