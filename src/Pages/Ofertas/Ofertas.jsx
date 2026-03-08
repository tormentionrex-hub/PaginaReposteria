import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import ProductCarousel from '../../Components/ProductCarousel';
import ServiceProducts from '../../Services/ServiceProducts';
import './Ofertas.css';

function Ofertas() {
    const [combos, setCombos] = useState([]);
    const [decoracion, setDecoracion] = useState([]);
    const [especiales, setEspeciales] = useState([]);

    useEffect(() => {
        async function cargarDatos() {
            const dataCombos = await ServiceProducts.getProductos("productos_combosFamiliares");
            const dataDecoracion = await ServiceProducts.getProductos("productos_decoracionPersonalizada");
            const dataEspeciales = await ServiceProducts.getProductos("productos_especialesDelMes");

            setCombos(dataCombos);
            setDecoracion(dataDecoracion);
            setEspeciales(dataEspeciales);
        }
        cargarDatos();
    }, []);

    const adaptarData = (arr) => {
        return arr.map(item => ({
            ...item,
            image: item.img_Url || `https://via.placeholder.com/280x200/ffe4eb/b55c70?text=${encodeURIComponent(item.name)}`,
            price: `₡${item.precio}`,
            desc: item.detalle
        }));
    };

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <Nav />
            <div className="contenido_pagina">
                <h1 className="titulo_pagina">Nuestras Ofertas</h1>
                <p className="subtitulo_pagina">Descubre promociones exclusivas en combos, decoraciones y especiales.</p>

                <div className="seccion_carruseles">
                    <ProductCarousel title="Combos Familiares" items={adaptarData(combos)} />
                    <ProductCarousel title="Decoración Personalizada" items={adaptarData(decoracion)} />
                    <ProductCarousel title="Especiales del Mes" items={adaptarData(especiales)} />
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default Ofertas;
