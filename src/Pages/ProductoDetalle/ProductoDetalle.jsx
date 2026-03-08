import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import Swal from 'sweetalert2';
import './ProductoDetalle.css';

const swalRosita = Swal.mixin({
    customClass: {
        confirmButton: 'swal_boton_confirmar',
        cancelButton: 'swal_boton_cancelar',
    },
    buttonsStyling: false,
});

const CONFIG_OPCIONES = {
    1: { // Queques
        label1: 'TAMAÑO (PORCIONES)',
        opts1: ['Pequeño (6-8 p.)', 'Mediano (12-15 p.)', 'Grande (20-25 p.)', 'Extra Grande (30+ p.)'],
        label2: 'SABOR DE QUEQUE',
        opts2: ['Vainilla', 'Chocolate', 'Red Velvet', 'Limón', 'Zanahoria'],
        label3: 'RELLENO PRINCIPAL',
        opts3: ['Fresa Natural', 'Crema de Chocolate', 'Arequipe', 'Frutos Rojos', 'Nutella']
    },
    2: { // Galletas
        label1: 'PRESENTACIÓN',
        opts1: ['Individual', 'Caja x6 unidades', 'Caja x12 unidades', 'Pack Familiar (24)'],
        label2: 'VARIEDAD',
        opts2: ['Clásicas', 'Con Relleno', 'Surtido Mix', 'Mini Galletitas'],
        label3: 'EXTRAS / EMPAQUE',
        opts3: ['Estándar', 'Decoración Sencilla', 'Empaque de Regalo']
    },
    3: { // Tartas
        label1: 'TAMAÑO TARTA',
        opts1: ['Personal', 'Mediana (8p)', 'Grande (14p)'],
        label2: 'TIPO DE BASE',
        opts2: ['Galleta Crujiente', 'Masa Hojaldrada', 'Base de Chocolate'],
        label3: 'CUBIERTA / TOPPING',
        opts3: ['Fresa Natural', 'Fresa y Chocolate', 'Fresa con Chantilly']
    },
    4: { // Cupcakes
        label1: 'CANTIDAD CUPCAKES',
        opts1: ['Pack x4 unidades', 'Caja x6 unidades', 'Caja x12 unidades'],
        label2: 'SABOR MASA',
        opts2: ['Vainilla', 'Chocolate', 'Red Velvet', 'Marmoleado'],
        label3: 'COBERTURA / FROSTING',
        opts3: ['Buttercream Classic', 'Crema de Queso', 'Ganache Chocolate']
    },
    5: { // Macarons
        label1: 'PRESENTACIÓN CAJA',
        opts1: ['Caja x6 (Surtida)', 'Caja x12 (Surtida)', 'Estuche de Regalo (24)'],
        label2: 'TEMÁTICA COLORES',
        opts2: ['Pastel Classic', 'Vibrantes Festivos', 'Blanco Elegante'],
        label3: 'SABORES PREDOMINANTES',
        opts3: ['Mix del Chef', 'Frutales', 'Dulces / Cremosos']
    },
    6: { // Combos
        label1: 'OPCIÓN DE COMBO',
        opts1: ['Combo Estándar', 'Combo Plus (Extra Cupcakes)', 'Combo Premium (Con Bebida)'],
        label2: 'SABOR PRINCIPAL',
        opts2: ['Vainilla / Frutas', 'Todo Chocolate', 'Mix Variado'],
        label3: 'COMPLEMENTOS',
        opts3: ['Fresa / Vainilla', 'Chocolate / Arequipe', 'Surtido de Temporada']
    },
    // Categorías restantes usan el default (Queques)
};

function ProductoDetalle() {
    const location = useLocation();
    const navigate = useNavigate();
    const producto = location.state?.producto;

    const [tamanio, setTamanio] = useState('');
    const [base, setBase] = useState('');
    const [relleno, setRelleno] = useState('');
    const [comentario, setComentario] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [cargando, setCargando] = useState(false);
    const [errorImagen, setErrorImagen] = useState(false);

    if (!producto) {
        navigate(-1);
        return null;
    }

    const catId = producto.categoria_id || 1;
    const config = CONFIG_OPCIONES[catId] || CONFIG_OPCIONES[1];

    // --- Lógica de Componente ---

    async function handleRealizarPedido() {
        if (!tamanio || !base || !relleno) {
            swalRosita.fire({
                icon: 'warning',
                title: 'Opciones incompletas',
                text: `Por favor selecciona ${config.label1.toLowerCase()}, ${config.label2.toLowerCase()} y ${config.label3.toLowerCase()}.`,
                confirmButtonText: 'Entendido',
            });
            return;
        }

        const storageUser = localStorage.getItem('user');
        const user = storageUser ? JSON.parse(storageUser) : null;

        if (!user) {
            const resLogin = await swalRosita.fire({
                icon: 'info',
                title: 'Inicia sesión',
                text: 'Debes iniciar sesión para realizar un pedido.',
                showCancelButton: true,
                confirmButtonText: 'Iniciar sesión',
            });
            if (resLogin.isConfirmed) navigate('/login');
            return;
        }

        const resConfirm = await swalRosita.fire({
            icon: 'question',
            title: '¿Confirmar pedido?',
            html: `¿Deseas pedir <strong>${producto.name}</strong> por ${producto.price}?`,
            showCancelButton: true,
            confirmButtonText: 'Sí, pedir',
        });

        if (!resConfirm.isConfirmed) return;

        setCargando(true);
        const nuevoPedido = {
            usuarioId: user.id,
            productoId: producto.id,
            tamanio,
            base,
            relleno,
            cantidad,
            comentario: comentario.trim(),
            total: (producto.precio || producto.price || 0) * cantidad,
            estado: 'pendiente',
            fecha: new Date().toISOString(),
        };

        try {
            // 1. Crear el encabezado del pedido
            const headerPedido = {
                usuarioId: user.id,
                productoId: producto.id, // Referencia rápida
                fecha: new Date().toISOString(),
                estado: 'pendiente',
                total: (producto.precio || producto.price || 0) * cantidad,
                comentario: comentario.trim()
            };

            const resPedido = await fetch('http://localhost:3001/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(headerPedido),
            });

            if (!resPedido.ok) throw new Error();
            const pedidoGuardado = await resPedido.json();

            // 2. Crear el detalle del pedido
            const detallePedido = {
                pedidoId: pedidoGuardado.id,
                productoId: producto.id,
                cantidad,
                precio: producto.precio || producto.price || 0,
                tamanio,
                base,
                relleno
            };

            const resDetalle = await fetch('http://localhost:3001/detalles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(detallePedido),
            });

            if (!resDetalle.ok) throw new Error();

            setCargando(false);
            swalRosita.fire({
                icon: 'success',
                title: '¡Pedido realizado!',
                text: 'Tu pedido fue enviado correctamente.',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => navigate(-1));
        } catch (error) {
            setCargando(false);
            swalRosita.fire({ icon: 'error', title: 'Error al enviar pedido' });
        }
    }

    function handleVolver() { navigate(-1); }
    function aumentarCantidad() { setCantidad(prev => prev + 1); }
    function disminuirCantidad() { setCantidad(prev => Math.max(1, prev - 1)); }

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <Nav />

            <div className="envoltura_detalle">
                <div className="migajas_pan">
                    <button onClick={handleVolver} className="boton_atras">← Volver</button>
                    <span>/ {producto.categoria || 'Productos'} / {producto.name}</span>
                </div>

                <div className="diseño_detalle">
                    <div className="columna_imagen">
                        <div className="marco_imagen_detalle">
                            {!errorImagen ? (
                                <img
                                    src={producto.image}
                                    alt={producto.name}
                                    className="imagen_principal_detalle"
                                    onError={() => setErrorImagen(true)}
                                />
                            ) : (
                                <div className="marcador_imagen_detalle">Sin imagen</div>
                            )}
                        </div>
                    </div>

                    <div className="columna_info_detalle">
                        <h1 className="nombre_producto_detalle">{producto.name}</h1>
                        <p className="descripcion_producto_detalle">{producto.desc}</p>
                        <p className="precio_producto_detalle">{producto.price}</p>

                        <div className="divisor_detalle"></div>

                        <div className="opciones_producto_detalle">
                            <div className="campo_detalle">
                                <label>{config.label1}</label>
                                <select value={tamanio} onChange={e => setTamanio(e.target.value)}>
                                    <option value="">Elige una opción</option>
                                    {config.opts1.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="campo_detalle">
                                <label>{config.label2}</label>
                                <select value={base} onChange={e => setBase(e.target.value)}>
                                    <option value="">Elige una opción</option>
                                    {config.opts2.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            <div className="campo_detalle">
                                <label>{config.label3}</label>
                                <select value={relleno} onChange={e => setRelleno(e.target.value)}>
                                    <option value="">Elige una opción</option>
                                    {config.opts3.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="campo_detalle fila_campo_detalle">
                                <div>
                                    <label>CANTIDAD</label>
                                    <div className="control_cantidad">
                                        <button onClick={disminuirCantidad}>−</button>
                                        <span>{cantidad}</span>
                                        <button onClick={aumentarCantidad}>+</button>
                                    </div>
                                </div>
                            </div>

                            <div className="campo_detalle">
                                <label>COMENTARIO ADICIONAL</label>
                                <textarea
                                    value={comentario}
                                    onChange={e => setComentario(e.target.value)}
                                    placeholder="Ej: Sin gluten, dedicatoria especial..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <button
                            className="boton_realizar_pedido"
                            onClick={handleRealizarPedido}
                            disabled={cargando}
                        >
                            {cargando ? 'Enviando pedido...' : 'Realizar Pedido'}
                        </button>
                    </div>
                </div>
            </div>

            <Fooder />
        </div>
    );
}

export default ProductoDetalle;
