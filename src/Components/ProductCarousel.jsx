import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/ProductCarousel.css';

function ProductCarousel({ title, items, categoria }) {
    const navigate = useNavigate();
    const itemsDuplicados = [...items, ...items];

    function verDetalle(item) {
        navigate('/producto', {
            state: {
                producto: {
                    ...item,
                    categoria: categoria || title || '',
                }
            }
        });
    }

    return (
        <div className="envoltura_carrusel">
            {title && <h2 className="titulo_carrusel">{title}</h2>}
            <div className="contenedor_carrusel">
                <div className="pista_carrusel">
                    {itemsDuplicados.map((item, index) => (
                        <div
                            className="tarjeta_carrusel"
                            key={index}
                            onClick={() => verDetalle(item)}
                            title={`Ver ${item.name}`}
                        >
                            <img src={item.image} alt={item.name} className="imagen_tarjeta" />
                            <div className="contenido_tarjeta">
                                <h3 className="nombre_tarjeta">{item.name}</h3>
                                <p className="descripcion_tarjeta">{item.desc}</p>
                                <span className="precio_tarjeta">{item.price}</span>
                                <span className="llamado_accion_tarjeta">Ver detalle →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductCarousel;
