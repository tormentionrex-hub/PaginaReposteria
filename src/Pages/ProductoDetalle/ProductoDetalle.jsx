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

const TAMANIOS = ['Pequeño (6 porciones)', 'Mediano (12 porciones)', 'Grande (20 porciones)', 'Extra Grande (30 porciones)'];
const BASES = ['Vainilla', 'Chocolate', 'Red Velvet', 'Limón', 'Zanahoria'];
const RELLENOS = ['Crema pastelera', 'Arequipe', 'Fresa', 'Chocolate', 'Sin relleno'];

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

    // --- Lógica de Componente ---

    async function handleRealizarPedido() {
        if (!tamanio || !base || !relleno) {
            swalRosita.fire({
                icon: 'warning',
                title: 'Opciones incompletas',
                text: 'Por favor selecciona el tamaño, la base y el relleno.',
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
            productoNombre: producto.name,
            productoImg: producto.image,
            productoPrecio: producto.price,
            categoria: producto.categoria || '',
            tamanio,
            base,
            relleno,
            cantidad,
            comentario: comentario.trim(),
            usuarioId: user.id,
            usuarioNombre: user.nombre,
            usuarioEmail: user.email,
            estado: 'pendiente',
            fecha: new Date().toISOString(),
        };

        try {
            const respuesta = await fetch('http://localhost:3001/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoPedido),
            });

            if (!respuesta.ok) throw new Error();

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
                                <label>TAMAÑO</label>
                                <select value={tamanio} onChange={e => setTamanio(e.target.value)}>
                                    <option value="">Elige una opción</option>
                                    {TAMANIOS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="campo_detalle">
                                <label>BASE</label>
                                <select value={base} onChange={e => setBase(e.target.value)}>
                                    <option value="">Elige una opción</option>
                                    {BASES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            <div className="campo_detalle">
                                <label>RELLENO</label>
                                <select value={relleno} onChange={e => setRelleno(e.target.value)}>
                                    <option value="">Elige una opción</option>
                                    {RELLENOS.map(r => <option key={r} value={r}>{r}</option>)}
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
