import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ServiceProducts from '../../services/ServiceProducts';
import AdminHeader from './AdminHeader';
import './MostrarProducts.css';

const swalRosita = Swal.mixin({
    customClass: {
        confirmButton: 'swal_boton_confirmar',
        cancelButton: 'swal_boton_cancelar',
    },
    buttonsStyling: false,
});

function MostrarProducts() {
    const [productos, setProductos] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState("productos_queques");
    const [nombre, setNombre] = useState("");
    const [detalle, setDetalle] = useState("");
    const [precio, setPrecio] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        async function cargarProductos() {
            const dataProductos = await ServiceProducts.getProductos(categoriaActual);
            setProductos(dataProductos);
            setEditandoId(null);
        }
        cargarProductos();
    }, [categoriaActual]);

    // --- Lógica de Componente ---

    async function handleGuardar(id) {
        if (!nombre.trim() || !detalle.trim() || !precio.trim()) {
            swalRosita.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor completa el nombre, detalle y precio.',
                confirmButtonText: 'Entendido',
            });
            return;
        }

        const objProducto = {
            producto: nombre,
            detalle: detalle,
            precio: precio,
            img: imgUrl
        };

        try {
            await ServiceProducts.patchProductos(categoriaActual, objProducto, id);
            setProductos(productos.map((prod) => prod.id === id ? { ...prod, ...objProducto } : prod));
            setEditandoId(null);
            swalRosita.fire({
                icon: 'success',
                title: '¡Actualizado!',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            swalRosita.fire({ icon: 'error', title: 'Error al guardar' });
        }
    }

    async function handleEliminar(id) {
        const prod = productos.find(p => p.id === id);
        const result = await swalRosita.fire({
            icon: 'warning',
            title: '¿Eliminar producto?',
            html: `Se eliminará <strong>"${prod?.producto}"</strong>.`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await ServiceProducts.deleteProductos(categoriaActual, id);
                setProductos(productos.filter((p) => p.id !== id));
                swalRosita.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
            } catch (error) {
                swalRosita.fire({ icon: 'error', title: 'Error al eliminar' });
            }
        }
    }

    function handleActivarEdicion(producto) {
        setEditandoId(producto.id);
        setNombre(producto.producto);
        setDetalle(producto.detalle);
        setPrecio(producto.precio);
        setImgUrl(producto.img || "");
    }

    function handleCancelarEdicion() {
        setEditandoId(null);
    }

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <AdminHeader />

            <div className="envoltura_admin_principal">
                <div className="contenedor_admin">
                    <h2 className="titulo_admin">Gestión de Productos</h2>
                    <p className="subtitulo_admin">Administra el catálogo de productos de cada categoría</p>

                    <div className="selector_categoria_admin">
                        <label>Categoría:</label>
                        <select
                            value={categoriaActual}
                            onChange={(e) => setCategoriaActual(e.target.value)}
                            className="desplegable_admin"
                        >
                            <option value="productos_queques">Queques</option>
                            <option value="productos_combosFamiliares">Combos Familiares</option>
                            <option value="productos_especialesDelMes">Especiales del Mes</option>
                            <option value="productos_galletas">Galletas</option>
                            <option value="productos_tartasDeFresa">Tartas de Fresa</option>
                            <option value="productos_cupcakesFestivos">Cupcakes Festivos</option>
                            <option value="productos_macaronsDulces">Macarons Dulces</option>
                            <option value="productos_decoracionPersonalizada">Decoración Personalizada</option>
                        </select>
                        <span className="insignia_conteo_admin">
                            {productos.length} {productos.length === 1 ? "producto" : "productos"}
                        </span>
                    </div>

                    <div className="rejilla_admin">
                        {productos.length === 0 ? (
                            <div className="estado_vacio">
                                <p>No hay productos en esta categoría aún.</p>
                            </div>
                        ) : (
                            productos.map((producto) => (
                                <div key={producto.id} className="tarjeta_admin">
                                    {editandoId === producto.id ? (
                                        <>
                                            <div className="formulario_edicion_admin">
                                                <label>Nombre:</label>
                                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                                <label>Detalle:</label>
                                                <textarea value={detalle} onChange={(e) => setDetalle(e.target.value)} rows={3} />
                                                <label>Precio:</label>
                                                <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} />
                                                <label>URL de Imagen:</label>
                                                <input type="text" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
                                            </div>
                                            <div className="acciones_admin">
                                                <button onClick={() => handleGuardar(producto.id)} className="boton_guardar">Guardar</button>
                                                <button onClick={handleCancelarEdicion} className="boton_cancelar">Cancelar</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="envoltura_imagen_admin">
                                                {producto.img ? (
                                                    <img src={producto.img} alt={producto.producto} className="imagen_producto_admin" />
                                                ) : (
                                                    <div className="marcador_imagen_vacia">🖼️</div>
                                                )}
                                            </div>
                                            <div className="info_producto_admin">
                                                <div className="cabecera_info_admin">
                                                    <h3>{producto.producto}</h3>
                                                    <span className="insignia_id_admin">#{producto.id}</span>
                                                </div>
                                                <p className="texto_detalle_admin">{producto.detalle}</p>
                                                <p className="precio_admin">{producto.precio}</p>
                                            </div>
                                            <div className="acciones_admin">
                                                <button onClick={() => handleActivarEdicion(producto)} className="boton_editar">Editar</button>
                                                <button onClick={() => handleEliminar(producto.id)} className="boton_eliminar">Eliminar</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MostrarProducts;
