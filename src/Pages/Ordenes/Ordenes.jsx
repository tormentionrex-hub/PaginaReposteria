import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import './Ordenes.css';

const COLORES_ESTADO = {
    'pendiente': 'estado_pendiente',
    'en_proceso': 'estado_proceso',
    'listo': 'estado_listo',
    'entregado': 'estado_entregado',
    'cancelado': 'estado_cancelado'
};

const ETIQUETAS_ESTADO = {
    'pendiente': 'Pendiente',
    'en_proceso': 'En Proceso',
    'listo': 'Listo para entrega',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
};

const ICONOS_ESTADO = {
    'pendiente': <Clock size={18} />,
    'en_proceso': <Truck size={18} />,
    'listo': <CheckCircle size={18} />,
    'entregado': <CheckCircle size={18} />,
    'cancelado': <XCircle size={18} />
};

function Ordenes() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const storageUser = localStorage.getItem('user');
    const user = storageUser ? JSON.parse(storageUser) : null;

    useEffect(() => {
        if (user) {
            cargarPedidos();
        }
    }, []);

    async function cargarPedidos() {
        try {
            const [resPedidos, resProducts, resDetalle] = await Promise.all([
                fetch(`http://localhost:3001/pedidos?usuarioId=${user.id}`),
                fetch('http://localhost:3001/productos'),
                fetch('http://localhost:3001/detalles')
            ]);

            if (!resPedidos.ok || !resProducts.ok || !resDetalle.ok) throw new Error();

            const [datosPedidos, datosProducts, datosDetalles] = await Promise.all([
                resPedidos.json(),
                resProducts.json(),
                resDetalle.json()
            ]);

            const productMap = Object.fromEntries(datosProducts.map(p => [p.id.toString(), p]));

            const misPedidosCompletos = datosPedidos.map(pedido => ({
                ...pedido,
                producto: productMap[pedido.productoId?.toString()],
                detalle: datosDetalles.find(d => d.pedidoId?.toString() === pedido.id?.toString())
            }));

            misPedidosCompletos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            setPedidos(misPedidosCompletos);
        } catch (error) {
            console.error("Error al cargar mis pedidos:", error);
        } finally {
            setCargando(false);
        }
    }

    const formatFecha = (isoString) => {
        const fecha = new Date(isoString);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="pagina_mis_pedidos">
            <div className="fondo_decorativo"></div>
            <Nav />

            <main className="contenido_mis_pedidos">
                <header className="cabecera_pedidos">
                    <div className="titulo_seccion_pedidos">
                        <Package className="icono_titulo" size={32} />
                        <h1>Mis Pedidos</h1>
                    </div>
                    <p className="subtitulo_pedidos">Sigue el estado de tus compras en tiempo real</p>
                </header>

                {cargando ? (
                    <div className="cargando_pedidos">
                        <div className="spinner_pedidos"></div>
                        <p>Cargando tus pedidos...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="sin_pedidos">
                        <Package size={64} className="icono_vacio" />
                        <h2>Aún no tienes pedidos</h2>
                        <p>¿Qué tal si exploras nuestros queques y dulces?</p>
                        <button className="boton_ir_tienda" onClick={() => window.location.href = '/'}>
                            Ver Productos
                        </button>
                    </div>
                ) : (
                    <div className="lista_pedidos">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className="tarjeta_pedido">
                                <div className="cuerpo_pedido">
                                    <div className="imagen_pedido_contenedor">
                                        <img
                                            src={pedido.producto?.img_Url || pedido.producto?.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587"}
                                            alt={pedido.producto?.name}
                                            className="imagen_pedido"
                                        />
                                    </div>

                                    <div className="info_pedido_primaria">
                                        <div className="encabezado_tarjeta">
                                            <span className="id_pedido">Pedido #{pedido.id}</span>
                                            <span className={`badge_estado ${COLORES_ESTADO[pedido.estado]}`}>
                                                {ICONOS_ESTADO[pedido.estado]}
                                                {ETIQUETAS_ESTADO[pedido.estado]}
                                            </span>
                                        </div>

                                        <h2 className="nombre_producto_pedido">{pedido.producto?.name || 'Producto'}</h2>
                                        <p className="fecha_pedido_etiqueta">{formatFecha(pedido.fecha)}</p>

                                        <div className="detalles_personalizacion">
                                            <div className="dato_personalizacion">
                                                <strong>Opciones:</strong> {pedido.detalle?.tamanio}, {pedido.detalle?.base}, {pedido.detalle?.relleno}
                                            </div>
                                            {pedido.comentario && (
                                                <div className="dato_personalizacion comentario_pedido">
                                                    <strong>Nota:</strong> "{pedido.comentario}"
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="resumen_pago_pedido">
                                        <div className="cantidad_pago">
                                            <span className="label_pago">Cantidad</span>
                                            <span className="valor_pago">{pedido.detalle?.cantidad || pedido.cantidad || 1}</span>
                                        </div>
                                        <div className="total_pago">
                                            <span className="label_pago">Total</span>
                                            <span className="valor_total">₡{pedido.total?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Fooder />
        </div>
    );
}

export default Ordenes;
