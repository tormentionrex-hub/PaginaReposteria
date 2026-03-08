import React, { useState, useEffect, useRef } from 'react';
import ServicesUsers from '../../Services/ServicesUsers';
import AdminHeader from './AdminHeader';
import Swal from 'sweetalert2';
import './AdminUsers.css';

const swalRosita = Swal.mixin({
    customClass: {
        confirmButton: 'swal_boton_confirmar',
        cancelButton: 'swal_boton_cancelar',
    },
    buttonsStyling: false,
});

function AdminUsers() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [usuarioAEditar, setUsuarioAEditar] = useState(null);

    const [editNombre, setEditNombre] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editFoto, setEditFoto] = useState('');
    const [editError, setEditError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const logged = localStorage.getItem("user");
        if (logged) setUsuarioActual(JSON.parse(logged));
        cargarUsuarios();
    }, []);

    // --- Lógica de Componente ---

    async function cargarUsuarios() {
        const data = await ServicesUsers.getUsers();
        setUsuarios(data);
    }

    async function handleToggleAdmin(usuario) {
        if (usuario.rol === 'owner') {
            swalRosita.fire({ icon: 'error', title: 'No permitido', text: 'No puedes cambiar el rol del Owner.' });
            return;
        }
        const nuevoRol = usuario.rol === 'admin' ? 'cliente' : 'admin';
        const result = await swalRosita.fire({
            icon: 'question',
            title: '¿Cambiar rol?',
            text: `Vas a cambiar el rol de ${usuario.name} a ${nuevoRol}.`,
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await ServicesUsers.patchUser(usuario.id, { rol: nuevoRol });
                swalRosita.fire({ icon: 'success', title: 'Rol actualizado', timer: 1500, showConfirmButton: false });
                cargarUsuarios();
            } catch (error) {
                swalRosita.fire({ icon: 'error', title: 'Error al cambiar rol' });
            }
        }
    }

    async function handleEliminarUsuario(id) {
        const u = usuarios.find(user => user.id === id);

        // 1. No se puede eliminar a uno mismo
        if (id === usuarioActual?.id) {
            swalRosita.fire({ icon: 'error', title: 'Operación no permitida', text: 'No puedes eliminar tu propia cuenta.' });
            return;
        }

        // 2. Jerarquía de Owner
        if (usuarioActual?.rol === 'owner') {
            // El owner puede borrar a cualquiera (admins y clientes) excepto a sí mismo (ya checkeado arriba)
        }
        // 3. Jerarquía de Admin
        else if (usuarioActual?.rol === 'admin') {
            if (u.rol === 'owner' || u.rol === 'admin') {
                swalRosita.fire({
                    icon: 'error',
                    title: 'Sin permisos',
                    text: 'Un administrador no puede eliminar a otros administradores ni al propietario.'
                });
                return;
            }
        } else {
            return; // No debería suceder si el acceso está restringido
        }

        const result = await swalRosita.fire({
            icon: 'warning',
            title: '¿Eliminar usuario?',
            text: `Se eliminará a ${u.name}.`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await ServicesUsers.deleteUser(id);
                swalRosita.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
                cargarUsuarios();
            } catch (error) {
                swalRosita.fire({ icon: 'error', title: 'Error al eliminar' });
            }
        }
    }

    function handleAbrirEdicion(usuario) {
        setUsuarioAEditar(usuario);
        setEditNombre(usuario.name);
        setEditEmail(usuario.email);
        setEditPassword('');
        setEditFoto(usuario.foto || '');
        setEditError('');
        setMostrarModalEdicion(true);
    }

    function handleCerrarEdicion() {
        setMostrarModalEdicion(false);
        setUsuarioAEditar(null);
    }

    function handleSeleccionarFoto(e) {
        const archivo = e.target.files[0];
        if (!archivo) return;
        if (archivo.size > 1024 * 1024) {
            setEditError('La imagen no debe superar 1MB.');
            return;
        }
        const lector = new FileReader();
        lector.onloadend = () => setEditFoto(lector.result);
        lector.readAsDataURL(archivo);
    }

    async function handleGuardarEdicion(e) {
        e.preventDefault();
        if (!editNombre.trim() || !editEmail.trim()) {
            swalRosita.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'No se permiten datos vacíos ni espacios en blanco en nombre y correo.'
            });
            return;
        }

        if (editPassword.trim()) {
            if (editPassword.trim().length < 8) {
                swalRosita.fire({
                    icon: 'error',
                    title: 'Contraseña muy corta',
                    text: 'La contraseña debe tener un mínimo de 8 caracteres.'
                });
                return;
            }
            if (editPassword.includes('-')) {
                swalRosita.fire({
                    icon: 'error',
                    title: 'Contraseña inválida',
                    text: 'No se permiten números negativos en la contraseña.'
                });
                return;
            }
        }

        const emailDuplicado = usuarios.find(u => u.email === editEmail && u.id !== usuarioAEditar.id);
        if (emailDuplicado) {
            setEditError('Ese correo ya está en uso.');
            return;
        }

        // --- VERIFICACIÓN DE PERMISOS PARA EDITAR ---
        if (usuarioActual?.id !== usuarioAEditar.id) { // Si no se edita a sí mismo
            if (usuarioActual?.rol === 'admin' && usuarioAEditar.rol !== 'cliente') {
                swalRosita.fire({ icon: 'error', title: 'No permitido', text: 'Solo puedes editar clientes.' });
                return;
            }
        }

        const datosActualizados = {
            name: editNombre.trim(),
            email: editEmail.trim(),
            foto: editFoto,
            ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
        };

        try {
            await ServicesUsers.patchUser(usuarioAEditar.id, datosActualizados);
            if (usuarioAEditar.id === usuarioActual?.id) {
                const nuevoUsuarioActual = { ...usuarioActual, ...datosActualizados };
                localStorage.setItem('user', JSON.stringify(nuevoUsuarioActual));
                setUsuarioActual(nuevoUsuarioActual);
            }
            cargarUsuarios();
            handleCerrarEdicion();
            swalRosita.fire({ icon: 'success', title: 'Actualizado', timer: 1500, showConfirmButton: false });
        } catch (error) {
            swalRosita.fire({ icon: 'error', title: 'Error al guardar cambios' });
        }
    }

    function puedeEditar(u) {
        if (!usuarioActual) return false;
        if (u.id === usuarioActual.id) return true; // Siempre puede editarse a sí mismo
        if (usuarioActual.rol === 'owner') return true; // El owner edita a cualquiera
        if (usuarioActual.rol === 'admin') return u.rol === 'cliente'; // Admin solo edita clientes
        return false;
    }

    function puedeEliminar(u) {
        if (!usuarioActual || u.id === usuarioActual.id) return false; // Nunca borrarse a sí mismo
        if (usuarioActual.rol === 'owner') return true; // Owner borra a cualquiera
        if (usuarioActual.rol === 'admin') return u.rol === 'cliente'; // Admin solo borra clientes
        return false;
    }

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <AdminHeader />

            <div className="envoltura_admin_principal">
                <div className="contenedor_admin">
                    <h2 className="titulo_admin">Gestión de Usuarios</h2>

                    <div className="contenedor_tabla_usuarios">
                        <table className="tabla_usuarios">
                            <thead>
                                <tr>
                                    <th>Avatar</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="avatar_tabla">
                                                <img src={u.foto || "https://i.pinimg.com/736x/52/17/11/5217111bf01e03621b31bfd2abbdbb6a.jpg"} alt="User" />
                                            </div>
                                        </td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`insignia_rol ${u.rol}`}>
                                                {u.rol === 'owner' ? 'Owner' : u.rol === 'admin' ? 'Admin' : 'Cliente'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="acciones_tabla">
                                                {usuarioActual?.rol === 'owner' && u.rol !== 'owner' && (
                                                    <button onClick={() => handleToggleAdmin(u)} className="boton_rol">
                                                        {u.rol === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                                                    </button>
                                                )}
                                                {puedeEditar(u) && (
                                                    <button onClick={() => handleAbrirEdicion(u)} className="boton_editar_usuario">Editar</button>
                                                )}
                                                {puedeEliminar(u) && (
                                                    <button onClick={() => handleEliminarUsuario(u.id)} className="boton_eliminar_usuario">Eliminar</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {mostrarModalEdicion && usuarioAEditar && (
                <div className="superposicion_modal_usuario" onClick={(e) => e.target === e.currentTarget && handleCerrarEdicion()}>
                    <div className="tarjeta_modal_usuario">
                        <div className="cabecera_modal_usuario">
                            <h3 className="titulo_modal_usuario">Editar Usuario</h3>
                            <button className="cerrar_modal_usuario" onClick={handleCerrarEdicion}>✕</button>
                        </div>

                        <div className="seccion_avatar_usuario">
                            <div className="vista_previa_avatar" onClick={() => fileInputRef.current.click()}>
                                <img src={editFoto || 'https://i.pinimg.com/736x/52/17/11/5217111bf01e03621b31bfd2abbdbb6a.jpg'} alt="Avatar" />
                                <div className="superposicion_avatar">Cambiar foto</div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleSeleccionarFoto} accept="image/*" style={{ display: 'none' }} />
                            <span className="pista_avatar">Haz clic en la foto para cambiarla (máx. 1MB)</span>
                        </div>

                        <form onSubmit={handleGuardarEdicion} className="formulario_modal_usuario">
                            <div className="grupo_entrada_usuario">
                                <label>Nombre completo</label>
                                <input type="text" value={editNombre} onChange={e => setEditNombre(e.target.value)} />
                            </div>
                            <div className="grupo_entrada_usuario">
                                <label>Correo electrónico</label>
                                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                            </div>
                            <div className="grupo_entrada_usuario">
                                <label>Nueva contraseña <span className="opcional_usuario">(opcional)</span></label>
                                <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Dejar vacío para no cambiar" />
                            </div>

                            <div className="fila_info_usuario">
                                <span className="etiqueta_info_usuario">Rol actual:</span>
                                <span className={`insignia_rol ${usuarioAEditar.rol}`}>
                                    {usuarioAEditar.rol === 'owner' ? 'Owner' : usuarioAEditar.rol === 'admin' ? 'Admin' : 'Cliente'}
                                </span>
                            </div>

                            {editError && <p className="error_usuario">{editError}</p>}

                            <div className="acciones_modal_usuario">
                                <button type="button" onClick={handleCerrarEdicion} className="boton_cancelar_usuario">Cancelar</button>
                                <button type="submit" className="boton_guardar_usuario">Guardar cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;
