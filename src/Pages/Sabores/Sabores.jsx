import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './Sabores.css';

function Sabores() {
    const [pasteles, setPasteles] = useState([]);

    useEffect(() => {
        async function cargarDatos() {
            const data = await ServiceProducts.getProductos("productos_sabores");
            setPasteles(data);
        }
        cargarDatos();
    }, []);

    const adaptarData = (arr) => {
        return arr.map(item => ({
            ...item,
            image: item.img_Url || "",
            price: `₡${item.precio}`,
            desc: item.detalle
        }));
    };

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <Nav />
            <div className="contenido_pagina">
                <h1 className="titulo_pagina">Nuestros Sabores</h1>
                <p className="subtitulo_pagina">¿Quieres un queque? Explora las deliciosas opciones que tenemos para ti.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Pasteles Sugeridos" items={adaptarData(pasteles)} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default Sabores;
