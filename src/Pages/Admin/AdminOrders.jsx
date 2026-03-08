import React, { useEffect, useState } from 'react';
import { RefreshCw, ShoppingCart, Eye, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import AdminHeader from './AdminHeader';
import './AdminOrders.css';

const swalRosita = Swal.mixin({
    customClass: {
        confirmButton: 'swal_boton_confirmar',
        cancelButton: 'swal_boton_cancelar',
    },
    buttonsStyling: false,
});

const ETIQUETAS_ESTADO = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    listo: 'Listo',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
};

const COLORES_ESTADO = {
    pendiente: 'badge_pendiente',
    en_proceso: 'badge_proceso',
    listo: 'badge_listo',
    entregado: 'badge_entregado',
    cancelado: 'badge_cancelado',
};

const CLASES_TARJETA = {
    pendiente: 'tarjeta_pendiente',
    en_proceso: 'tarjeta_proceso',
    listo: 'tarjeta_listo',
    entregado: 'tarjeta_entregado',
    cancelado: 'badge_cancelado',
};

const CONFIG_LABELS = {
    1: { l1: 'Tamaño', l2: 'Base', l3: 'Relleno' },
    2: { l1: 'Pres.', l2: 'Variedad', l3: 'Extras' },
    3: { l1: 'Tamaño', l2: 'Base', l3: 'Topping' },
    4: { l1: 'Pack', l2: 'Sabor', l3: 'Cobertura' },
    5: { l1: 'Caja', l2: 'Temática', l3: 'Sabores' },
    6: { l1: 'Opción', l2: 'Sabor 1', l3: 'Sabor 2' },
};

function AdminOrders() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [pedidoActivo, setPedidoActivo] = useState(null);

    useEffect(() => {
        cargarPedidos();
    }, []);

    // --- Lógica de Componente ---

    async function cargarPedidos() {
        setCargando(true);
        try {
            // Fetch everything in parallel to bypass unreliable expansion
            const [resPedidos, resUsers, resProducts, resDetalle] = await Promise.all([
                fetch('http://localhost:3001/pedidos'),
                fetch('http://localhost:3001/usuarios'),
                fetch('http://localhost:3001/productos'),
                fetch('http://localhost:3001/detalles')
            ]);

            if (!resPedidos.ok || !resUsers.ok || !resProducts.ok || !resDetalle.ok)
                throw new Error('Error al cargar datos');

            const [datosPedidos, datosUsers, datosProducts, datosDetalles] = await Promise.all([
                resPedidos.json(),
                resUsers.json(),
                resProducts.json(),
                resDetalle.json()
            ]);

            // Efficient mapping by ID
            const userMap = Object.fromEntries(datosUsers.map(u => [u.id.toString(), u]));
            const productMap = Object.fromEntries(datosProducts.map(p => [p.id.toString(), p]));

            // Build the final objects manually
            const pedidosCompletos = datosPedidos.map(pedido => ({
                ...pedido,
                usuario: userMap[pedido.usuarioId?.toString()],
                producto: productMap[pedido.productoId?.toString()],
                detalle: datosDetalles.filter(d => d.pedidoId?.toString() === pedido.id?.toString())
            }));

            const ordenados = pedidosCompletos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            setPedidos(ordenados);
        } catch (error) {
            console.error("Fetch error:", error);
            swalRosita.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudieron cargar los pedidos sincronizados.',
                confirmButtonText: 'Cerrar',
            });
        } finally {
            setCargando(false);
        }
    }

    async function cambiarEstado(pedido, nuevoEstado) {
        try {
            const respuesta = await fetch(`http://localhost:3001/pedidos/${pedido.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado }),
            });
            if (!respuesta.ok) throw new Error();

            setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, estado: nuevoEstado } : p));
            if (pedidoActivo?.id === pedido.id) {
                setPedidoActivo(prev => ({ ...prev, estado: nuevoEstado }));
            }
        } catch (error) {
            swalRosita.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estado.',
                confirmButtonText: 'Cerrar',
            });
        }
    }

    async function eliminarPedido(pedido) {
        const resultado = await swalRosita.fire({
            icon: 'warning',
            title: '¿Eliminar pedido?',
            html: `<p>Se eliminará el pedido de <strong>"${pedido.producto?.name || 'Producto desconocido'}"</strong>.</p>`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!resultado.isConfirmed) return;

        try {
            const respuesta = await fetch(`http://localhost:3001/pedidos/${pedido.id}`, {
                method: 'DELETE',
            });
            if (!respuesta.ok) throw new Error();

            setPedidos(prev => prev.filter(p => p.id !== pedido.id));
            if (pedidoActivo?.id === pedido.id) setPedidoActivo(null);

            swalRosita.fire({
                icon: 'success',
                title: 'Pedido eliminado',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            swalRosita.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el pedido.',
                confirmButtonText: 'Cerrar',
            });
        }
    }

    function formatFecha(fechaIso) {
        if (!fechaIso) return '—';
        return new Date(fechaIso).toLocaleDateString('es-CR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    function obtenerPedidosFiltrados() {
        return pedidos.filter(p => {
            const coincideEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
            const termino = busqueda.toLowerCase();
            const coincideBusqueda = !busqueda ||
                p.producto?.name?.toLowerCase().includes(termino) ||
                p.usuario?.name?.toLowerCase().includes(termino) ||
                p.usuario?.email?.toLowerCase().includes(termino);
            return coincideEstado && coincideBusqueda;
        });
    }

    function obtenerContadores() {
        return pedidos.reduce((acc, p) => {
            acc[p.estado] = (acc[p.estado] || 0) + 1;
            return acc;
        }, {});
    }

    const pedidosFiltrados = obtenerPedidosFiltrados();
    const contadores = obtenerContadores();

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <AdminHeader />

            <div className="envoltura_admin_principal">
                <div className="contenedor_admin">

                    {/* Cabecera */}
                    <div className="cabecera_pedidos">
                        <div>
                            <h2 className="titulo_admin">Gestión de Pedidos</h2>
                            <p className="subtitulo_admin">Visualiza y gestiona todos los pedidos de tus clientes</p>
                        </div>
                        <button className="boton_actualizar" onClick={cargarPedidos}>
                            <RefreshCw size={15} /> Actualizar
                        </button>
                    </div>

                    {/* Estadísticas */}
                    <div className="estadisticas_pedidos">
                        <div className="tarjeta_estadistica">
                            <span className="numero_estadistica">{pedidos.length}</span>
                            <span className="etiqueta_estadistica">Total</span>
                        </div>
                        <div className="tarjeta_estadistica tarjeta_pendiente">
                            <span className="numero_estadistica">{contadores.pendiente || 0}</span>
                            <span className="etiqueta_estadistica">Pendientes</span>
                        </div>
                        <div className="tarjeta_estadistica tarjeta_proceso">
                            <span className="numero_estadistica">{contadores.en_proceso || 0}</span>
                            <span className="etiqueta_estadistica">En proceso</span>
                        </div>
                        <div className="tarjeta_estadistica tarjeta_listo">
                            <span className="numero_estadistica">{contadores.listo || 0}</span>
                            <span className="etiqueta_estadistica">Listos</span>
                        </div>
                        <div className="tarjeta_estadistica tarjeta_entregado">
                            <span className="numero_estadistica">{contadores.entregado || 0}</span>
                            <span className="etiqueta_estadistica">Entregados</span>
                        </div>
                    </div>

                    {/* Filtros y Buscador */}
                    <div className="filtros_pedidos">
                        <input
                            className="buscador_pedidos"
                            type="text"
                            placeholder="Buscar por producto, cliente o email..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                        <div className="pestanas_filtros">
                            {['todos', 'pendiente', 'en_proceso', 'listo', 'entregado', 'cancelado'].map(estado => (
                                <button
                                    key={estado}
                                    className={`pestana_filtro ${filtroEstado === estado ? 'pestana_activa' : ''}`}
                                    onClick={() => setFiltroEstado(estado)}
                                >
                                    {estado === 'todos' ? 'Todos' : ETIQUETAS_ESTADO[estado]}
                                    {estado !== 'todos' && contadores[estado] ? (
                                        <span className="contador_pestana">{contadores[estado]}</span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Área de Tabla */}
                    <div className="area_contenido_pedidos">
                        {cargando ? (
                            <div className="cargando_pedidos">
                                <div className="rueda_carga"></div>
                                <p>Cargando pedidos...</p>
                            </div>
                        ) : pedidosFiltrados.length === 0 ? (
                            <div className="pedidos_vacios">
                                <div className="icono_vacio"><ShoppingCart size={64} /></div>
                                <h3>Sin pedidos</h3>
                                <p>No hay pedidos que coincidan con los criterios.</p>
                            </div>
                        ) : (
                            <div className="envoltura_tabla_pedidos">
                                <table className="tabla_pedidos">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cliente</th>
                                            <th>Opciones</th>
                                            <th>Cant.</th>
                                            <th>Precio</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosFiltrados.map(pedido => (
                                            <tr key={pedido.id} className="fila_pedido" onClick={() => setPedidoActivo(pedido)}>
                                                <td className="celda_producto">
                                                    <div className="info_producto">
                                                        {(pedido.producto?.img_Url || pedido.producto?.image) && (
                                                            <img src={pedido.producto?.img_Url || pedido.producto?.image} alt={pedido.producto?.name} className="imagen_producto_tabla" />
                                                        )}
                                                        <span>{pedido.producto?.name || 'Sin nombre'}</span>
                                                    </div>
                                                </td>
                                                <td className="celda_cliente">
                                                    <div className="info_cliente">
                                                        <strong>{pedido.usuario?.name || 'Usuario desconocido'}</strong>
                                                        <small>{pedido.usuario?.email || 'No email'}</small>
                                                    </div>
                                                </td>
                                                <td className="celda_opciones">
                                                    <span>{pedido.detalle?.[0]?.tamanio}</span><br />
                                                    <small>
                                                        {pedido.detalle?.[0]?.base} · {pedido.detalle?.[0]?.relleno}
                                                    </small>
                                                </td>
                                                <td className="celda_cantidad">{pedido.detalle?.[0]?.cantidad || 0}</td>
                                                <td className="celda_precio">{pedido.total}</td>
                                                <td className="celda_fecha">{formatFecha(pedido.fecha)}</td>
                                                <td className="celda_estado" onClick={e => e.stopPropagation()}>
                                                    <select
                                                        className={`badge_estado_admin ${COLORES_ESTADO[pedido.estado]}`}
                                                        value={pedido.estado}
                                                        onChange={e => cambiarEstado(pedido, e.target.value)}
                                                    >
                                                        {Object.entries(ETIQUETAS_ESTADO).map(([val, label]) => (
                                                            <option key={val} value={val}>{label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="celda_acciones" onClick={e => e.stopPropagation()}>
                                                    <button className="boton_ver_detalle" onClick={() => setPedidoActivo(pedido)}>
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="boton_eliminar_pedido" onClick={() => eliminarPedido(pedido)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="etiqueta_conteo">
                                    Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Detalle */}
            {pedidoActivo && (
                <div className="superposicion_modal" onClick={() => setPedidoActivo(null)}>
                    <div className="ventana_modal" onClick={e => e.stopPropagation()}>
                        <button className="cerrar_modal" onClick={() => setPedidoActivo(null)}>✕</button>

                        <h3 className="titulo_modal">Detalle del Pedido #{pedidoActivo.id}</h3>

                        <div className="fila_imagen_modal">
                            {(pedidoActivo.producto?.img_Url || pedidoActivo.producto?.image) && (
                                <img src={pedidoActivo.producto?.img_Url || pedidoActivo.producto?.image} alt={pedidoActivo.producto?.name} className="imagen_modal" />
                            )}
                            <div className="nombre_producto_modal">
                                <h4>{pedidoActivo.producto?.name}</h4>
                                <span className={`insignia_estado ${COLORES_ESTADO[pedidoActivo.estado]}`}>
                                    {ETIQUETAS_ESTADO[pedidoActivo.estado]}
                                </span>
                            </div>
                        </div>

                        <div className="rejilla_modal">
                            <div className="campo_modal">
                                <label>Cliente</label>
                                <span>{pedidoActivo.usuario?.name}</span>
                            </div>
                            <div className="campo_modal">
                                <label>Email</label>
                                <span>{pedidoActivo.usuario?.email}</span>
                            </div>
                            <div className="campo_modal">
                                <label>{CONFIG_LABELS[pedidoActivo.producto?.categoria_id]?.l1 || 'Tamaño'}</label>
                                <span>{pedidoActivo.detalle?.[0]?.tamanio}</span>
                            </div>
                            <div className="campo_modal">
                                <label>{CONFIG_LABELS[pedidoActivo.producto?.categoria_id]?.l2 || 'Base'}</label>
                                <span>{pedidoActivo.detalle?.[0]?.base}</span>
                            </div>
                            <div className="campo_modal">
                                <label>{CONFIG_LABELS[pedidoActivo.producto?.categoria_id]?.l3 || 'Relleno'}</label>
                                <span>{pedidoActivo.detalle?.[0]?.relleno}</span>
                            </div>
                            <div className="campo_modal">
                                <label>Cantidad</label>
                                <span>{pedidoActivo.detalle?.[0]?.cantidad}</span>
                            </div>
                            <div className="campo_modal">
                                <label>Precio total</label>
                                <span>{pedidoActivo.total}</span>
                            </div>

                            <div className="campo_modal campo_modal_ancho">
                                <label>Comentario</label>
                                <span>{pedidoActivo.comentario || 'Sin comentarios'}</span>
                            </div>
                            <div className="campo_modal">
                                <label>Fecha del pedido</label>
                                <span>{formatFecha(pedidoActivo.fecha)}</span>
                            </div>
                        </div>

                        <div className="fila_estado_modal">
                            <label>Cambiar estado:</label>
                            <select
                                className={`selector_estado ${COLORES_ESTADO[pedidoActivo.estado]}`}
                                value={pedidoActivo.estado}
                                onChange={e => cambiarEstado(pedidoActivo, e.target.value)}
                            >
                                {Object.entries(ETIQUETAS_ESTADO).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pie_modal">
                            <button className="boton_eliminar_modal" onClick={() => eliminarPedido(pedidoActivo)}>
                                <Trash2 size={15} /> Eliminar pedido
                            </button>
                            <button className="boton_cerrar_modal" onClick={() => setPedidoActivo(null)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
