import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../Components/Nav';
import Swal from 'sweetalert2';
import ServicesUsers from '../../Services/ServicesUsers';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editNombre, setEditNombre] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editFoto, setEditFoto] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = localStorage.getItem("user");
        if (loggedUser) {
            const parsedUser = JSON.parse(loggedUser);
            setUser(parsedUser);
            setEditNombre(parsedUser.name);
            setEditEmail(parsedUser.email);
            setEditFoto(parsedUser.foto || "");
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // --- Lógica de Componente ---

    function handleLogout() {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¡Esperamos verte pronto!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#b55c70',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user");
                navigate('/login');
            }
        });
    }

    function handleFotoChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditFoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleEliminarFoto() {
        setEditFoto("");
    }

    async function handleUpdate(e) {
        e.preventDefault();
        setError("");

        if (!editNombre || !editEmail) {
            setError("Nombre y correo son obligatorios.");
            return;
        }

        if (currentPassword || newPassword || confirmPassword) {
            if (currentPassword !== user.password) {
                setError("Contraseña actual incorrecta.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setError("Las nuevas contraseñas no coinciden.");
                return;
            }
        }

        try {
            const updatedData = {
                name: editNombre,
                email: editEmail,
                foto: editFoto,
                password: newPassword || user.password
            };

            const updatedUser = await ServicesUsers.patchUser(user.id, updatedData);
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            Swal.fire({ icon: 'success', title: '¡Actualizado!', timer: 2000, showConfirmButton: false });
            setShowModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error al actualizar' });
        }
    }

    function abrirEdicion() { setShowModal(true); }
    function cerrarEdicion() { setShowModal(false); }
    function volverAlSitio() { navigate('/'); }

    if (!user) return null;

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <Nav />
            <button className="boton_volver_inicio" onClick={volverAlSitio}>
                <i>←</i> Volver
            </button>
            <div className="contenido_perfil">
                <div className="tarjeta_perfil">
                    <div className="cabecera_perfil">
                        <div className="avatar_perfil">
                            <img src={user.foto || "https://i.pinimg.com/736x/52/17/11/5217111bf01e03621b31bfd2abbdbb6a.jpg"} alt="Perfil" className="imagen_avatar" />
                        </div>
                        <h2 className="nombre_perfil">¡Hola, {user.name}!</h2>
                        <p className="email_perfil">{user.email}</p>
                    </div>

                    <div className="info_perfil">
                        <div className="item_info">
                            <span>Rol de Usuario:</span>
                            <p>{user.rol === "owner" ? "Propietario" : user.rol === "admin" ? "Administrador" : "Cliente"}</p>
                        </div>
                        <div className="item_info">
                            <span>Estado de Cuenta:</span>
                            <p className="estado_activo">Activo</p>
                        </div>
                    </div>

                    <div className="acciones_perfil">
                        <button onClick={abrirEdicion} className="boton_editar">Editar Perfil</button>
                        <button onClick={handleLogout} className="boton_logout">Cerrar Sesión</button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="superposicion_modal" onClick={(e) => e.target === e.currentTarget && cerrarEdicion()}>
                    <div className="tarjeta_modal">
                        <h3 className="titulo_modal">Editar Perfil</h3>
                        <form onSubmit={handleUpdate} className="formulario_modal">

                            <div className="seccion_foto_modal">
                                <div className="avatar_previsualizacion">
                                    <img
                                        src={editFoto || "https://i.pinimg.com/736x/52/17/11/5217111bf01e03621b31bfd2abbdbb6a.jpg"}
                                        alt="Previsualización"
                                        className="imagen_avatar"
                                    />
                                </div>
                                <div className="controles_foto">
                                    <label htmlFor="input_foto" className="boton_cambiar_foto">
                                        Cambiar Foto
                                        <input
                                            type="file"
                                            id="input_foto"
                                            accept="image/*"
                                            onChange={handleFotoChange}
                                            hidden
                                        />
                                    </label>
                                    {editFoto && (
                                        <button type="button" onClick={handleEliminarFoto} className="boton_eliminar_foto">
                                            Eliminar Foto
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grupo_entrada">
                                <label>Nombre</label>
                                <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} />
                            </div>
                            <div className="grupo_entrada">
                                <label>Email</label>
                                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                            </div>

                            <hr className="divisor_modal" />
                            <p className="subtitulo_modal">Cambiar Contraseña (Opcional)</p>

                            <div className="grupo_entrada">
                                <label>Contraseña Actual</label>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                            </div>
                            <div className="grupo_entrada">
                                <label>Nueva Contraseña</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                            </div>
                            <div className="grupo_entrada">
                                <label>Confirmar Nueva Contraseña</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                            </div>

                            {error && <p className="error_autenticacion">{error}</p>}

                            <div className="acciones_modal">
                                <button type="button" onClick={cerrarEdicion} className="boton_cancelar">Cancelar</button>
                                <button type="submit" className="boton_guardar">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
