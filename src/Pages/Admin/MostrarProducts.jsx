import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ServiceProducts from '../../Services/ServiceProducts';
import AdminHeader from './AdminHeader';
import './MostrarProducts.css';

const swalRosita = Swal.mixin({
    customClass: {
        confirmButton: 'swal_boton_confirmar',
        cancelButton: 'swal_boton_cancelar',
    },
    buttonsStyling: false,
});

const categoryMapping = {
    productos: [
        { value: "productos_queques", label: "Queques" },
        { value: "productos_galletas", label: "Galletas" },
        { value: "productos_tartasDeFresa", label: "Tartas de Fresa" },
        { value: "productos_cupcakesFestivos", label: "Cupcakes Festivos" },
        { value: "productos_macaronsDulces", label: "Macarons Dulces" }
    ],
    ofertas: [
        { value: "productos_combosFamiliares", label: "Combos Familiares" },
        { value: "productos_especialesDelMes", label: "Especiales del Mes" },
        { value: "productos_decoracionPersonalizada", label: "Decoración Personalizada" }
    ],
    sabores: [
        { value: "productos_sabores", label: "Pasteles Sugeridos" }
    ]
};

const categoryReverseMapping = {
    "productos_queques": 1,
    "productos_combosFamiliares": 2,
    "productos_especialesDelMes": 3,
    "productos_cupcakesFestivos": 4,
    "productos_macaronsDulces": 5,
    "productos_decoracionPersonalizada": 6,
    "productos_galletas": 7,
    "productos_tartasDeFresa": 8,
    "productos_sabores": 9
};

const subcategoryMapping = {
    "productos_queques": ["Nuestros Clásicos", "Especiales para Ti", "Línea Premium (Fondant)"],
    "productos_galletas": ["Chocochip Clásicas", "Rellenas de Nutella", "Avena y Pasas", "Mantequilla Suaves"],
    "productos_tartasDeFresa": ["Mini Tartas Individuales", "Tartas Familiares", "Opciones Veganas", "Tartaletas con Cacao"],
    "productos_macaronsDulces": ["Clásicos de Vainilla", "Favoritos de Pistacho", "Frambuesa y Frutos", "Cajas de Regalo"],
    "productos_combosFamiliares": ["Para Desayunos", "Para Fiestas", "Especial de Cumpleaños", "Nuestros Mega Combos"],
    "productos_especialesDelMes": ["Amantes de las Fresas", "Fiebre de Cacao", "Opciones Saludables", "Selección del Chef"],
    "productos_cupcakesFestivos": ["Vainilla Clásica", "Chocolate Extremo", "Nuestros Red Velvet", "Arcoíris Infantiles"],
    "productos_decoracionPersonalizada": ["Fiestas Infantiles", "Bodas y Aniversarios", "Minimalistas", "Temáticas Exclusivas"],
    "productos_sabores": ["Pasteles Sugeridos"]
};

function MostrarProducts({ type = "productos" }) {
    const [productos, setProductos] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState("");
    const [nombre, setNombre] = useState("");
    const [detalle, setDetalle] = useState("");
    const [precio, setPrecio] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [subcategoria, setSubcategoria] = useState("");
    const [editandoId, setEditandoId] = useState(null);
    const [mostrandoCrear, setMostrandoCrear] = useState(false);

    useEffect(() => {
        const defaultCat = categoryMapping[type][0].value;
        setCategoriaActual(defaultCat);
        setSubcategoria(subcategoryMapping[defaultCat][0]);
    }, [type]);

    useEffect(() => {
        if (categoriaActual) {
            cargarProductos();
            // Al cambiar la categoría, reseteamos la subcategoría a la primera disponible de esa categoría
            if (subcategoryMapping[categoriaActual]) {
                setSubcategoria(subcategoryMapping[categoriaActual][0]);
            }
        }
    }, [categoriaActual]);

    async function cargarProductos() {
        const dataProductos = await ServiceProducts.getProductos(categoriaActual);
        setProductos(dataProductos);
        setEditandoId(null);
        setMostrandoCrear(false);
    }

    async function handleGuardar(id) {
        if (!nombre.trim() || !detalle.trim() || !precio) {
            swalRosita.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Completa nombre, detalle y precio.',
            });
            return;
        }

        const objProducto = {
            name: nombre,
            detalle: detalle,
            precio: Number(precio),
            img_Url: imgUrl,
            subcategoria: subcategoria,
            categoria_id: categoryReverseMapping[categoriaActual]
        };

        try {
            if (id) {
                await ServiceProducts.patchProductos(objProducto, id);
                setProductos(productos.map((prod) => prod.id === id ? { ...prod, ...objProducto } : prod));
                setEditandoId(null);
            } else {
                const nuevo = await ServiceProducts.postProductos(objProducto);
                setProductos([...productos, nuevo]);
                setMostrandoCrear(false);
            }

            swalRosita.fire({
                icon: 'success',
                title: id ? '¡Actualizado!' : '¡Creado!',
                timer: 1500,
                showConfirmButton: false,
            });
            limpiarCampos();
        } catch (error) {
            swalRosita.fire({ icon: 'error', title: 'Error al procesar' });
        }
    }

    async function handleEliminar(id) {
        const prod = productos.find(p => p.id === id);
        const result = await swalRosita.fire({
            icon: 'warning',
            title: '¿Eliminar?',
            html: `Se eliminará <strong>"${prod?.name}"</strong>.`,
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
        });

        if (result.isConfirmed) {
            try {
                await ServiceProducts.deleteProductos(id);
                setProductos(productos.filter((p) => p.id !== id));
                swalRosita.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
            } catch (error) {
                swalRosita.fire({ icon: 'error', title: 'Error al eliminar' });
            }
        }
    }

    function handleActivarEdicion(producto) {
        setEditandoId(producto.id);
        setMostrandoCrear(false);
        setNombre(producto.name);
        setDetalle(producto.detalle);
        setPrecio(producto.precio);
        setImgUrl(producto.img_Url || "");
        setSubcategoria(producto.subcategoria || (subcategoryMapping[categoriaActual] ? subcategoryMapping[categoriaActual][0] : ""));
    }

    function handleActivarCrear() {
        limpiarCampos();
        setEditandoId(null);
        setMostrandoCrear(true);
    }

    function limpiarCampos() {
        setNombre("");
        setDetalle("");
        setPrecio("");
        setImgUrl("");
        if (subcategoryMapping[categoriaActual]) {
            setSubcategoria(subcategoryMapping[categoriaActual][0]);
        }
    }

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <AdminHeader />

            <div className="envoltura_admin_principal">
                <div className="contenedor_admin">
                    <div className="cabecera_seccion_admin">
                        <h2 className="titulo_admin">Gestión de {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                        <button className="boton_añadir_producto" onClick={handleActivarCrear}>
                            + Añadir {type === 'sabores' ? 'Sabor' : 'Producto'}
                        </button>
                    </div>

                    <div className="selector_categoria_admin">
                        <label>Categoría:</label>
                        <select
                            value={categoriaActual}
                            onChange={(e) => setCategoriaActual(e.target.value)}
                            className="desplegable_admin"
                        >
                            {categoryMapping[type].map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <span className="insignia_conteo_admin">
                            {productos.length} ítems
                        </span>
                    </div>

                    <div className="rejilla_admin">
                        {mostrandoCrear && (
                            <div className="tarjeta_admin tarjeta_creacion">
                                <div className="formulario_edicion_admin">
                                    <h3>Nuevo {type === 'sabores' ? 'Sabor' : 'Producto'}</h3>
                                    <label>Nombre:</label>
                                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Queque de Selva Negra" />
                                    <label>Detalle:</label>
                                    <textarea value={detalle} onChange={(e) => setDetalle(e.target.value)} rows={3} placeholder="Descripción del producto..." />
                                    <label>Precio:</label>
                                    <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="0" />
                                    <label>Subcategoría (Carrusel):</label>
                                    <select
                                        value={subcategoria}
                                        onChange={(e) => setSubcategoria(e.target.value)}
                                        className="desplegable_admin"
                                    >
                                        {subcategoryMapping[categoriaActual]?.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                    <label>URL de Imagen:</label>
                                    <input type="text" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://..." />
                                </div>
                                <div className="acciones_admin">
                                    <button onClick={() => handleGuardar()} className="boton_guardar">Crear</button>
                                    <button onClick={() => setMostrandoCrear(false)} className="boton_cancelar">Cancelar</button>
                                </div>
                            </div>
                        )}

                        {productos.length === 0 && !mostrandoCrear ? (
                            <div className="estado_vacio">
                                <p>No hay elementos en esta categoría.</p>
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
                                                <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
                                                <label>Subcategoría:</label>
                                                <select
                                                    value={subcategoria}
                                                    onChange={(e) => setSubcategoria(e.target.value)}
                                                    className="desplegable_admin"
                                                >
                                                    {subcategoryMapping[categoriaActual]?.map(sub => (
                                                        <option key={sub} value={sub}>{sub}</option>
                                                    ))}
                                                </select>
                                                <label>URL de Imagen:</label>
                                                <input type="text" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
                                            </div>
                                            <div className="acciones_admin">
                                                <button onClick={() => handleGuardar(producto.id)} className="boton_guardar">Guardar</button>
                                                <button onClick={() => setEditandoId(null)} className="boton_cancelar">Cancelar</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="envoltura_imagen_admin">
                                                {producto.img_Url ? (
                                                    <img src={producto.img_Url} alt={producto.name} className="imagen_producto_admin" />
                                                ) : (
                                                    <div className="marcador_imagen_vacia">🖼️</div>
                                                )}
                                            </div>
                                            <div className="info_producto_admin">
                                                <div className="cabecera_info_admin">
                                                    <h3>{producto.name}</h3>
                                                    <span className="insignia_id_admin">#{producto.id}</span>
                                                </div>
                                                <p className="sub_badge_admin">{producto.subcategoria || 'Sin subcategoría'}</p>
                                                <p className="texto_detalle_admin">{producto.detalle}</p>
                                                <p className="precio_admin">₡{producto.precio}</p>
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
