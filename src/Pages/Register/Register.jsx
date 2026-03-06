import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ServicesUsers from '../../Services/ServicesUsers';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import './Register.css';

function Register() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [foto, setFoto] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // --- Lógica de Componente ---

    function handleFoto(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'Imagen muy pesada',
                text: 'Por favor, elige una foto menor a 1MB.',
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setFoto(reader.result);
        reader.readAsDataURL(file);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !email.trim() || !password.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'No se permiten datos vacíos ni espacios en blanco.',
            });
            return;
        }

        if (password.trim().length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña muy corta',
                text: 'La contraseña debe tener un mínimo de 8 caracteres.',
            });
            return;
        }

        if (password.includes('-')) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña inválida',
                text: 'No se permiten números negativos en la contraseña.',
            });
            return;
        }

        try {
            const usuarios = await ServicesUsers.getUsers();
            if (usuarios.find(u => u.email === email)) {
                setError("El correo electrónico ya está registrado.");
                return;
            }

            const nuevoUsuario = {
                nombre,
                email,
                password,
                foto: foto || "",
                rol: "cliente"
            };

            await ServicesUsers.postUser(nuevoUsuario);
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/login');
        } catch (err) {
            setError("Error al registrar: " + err.message);
        }
    }

    function activarCargaFoto() {
        fileInputRef.current.click();
    }

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <Nav />
            <div className="contenido_autenticacion">
                <div className="tarjeta_autenticacion">
                    <h2 className="titulo_autenticacion">Crear Cuenta</h2>
                    <p className="subtitulo_autenticacion">Únete a la familia de Repostería Rosita</p>

                    <form onSubmit={handleSubmit} className="formulario_autenticacion">
                        {/* Selector de Foto */}
                        <div className="contenedor_carga_foto">
                            <div className="circulo_previsualizacion_foto" onClick={activarCargaFoto}>
                                {foto ? (
                                    <img src={foto} alt="Preview" />
                                ) : (
                                    <div className="marcador_posicion_foto">
                                        <img src="https://i.pinimg.com/736x/52/17/11/5217111bf01e03621b31bfd2abbdbb6a.jpg" alt="Icono" className="imagen_marcador" />
                                    </div>
                                )}
                            </div>
                            <span className="texto_carga" onClick={activarCargaFoto}>
                                {foto ? "Cambiar foto de perfil" : "Agregar foto de perfil"}
                            </span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFoto}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />
                        </div>

                        <div className="grupo_entrada">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div className="grupo_entrada">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                            />
                        </div>

                        <div className="grupo_entrada">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="error_autenticacion">{error}</p>}

                        <button type="submit" className="boton_autenticacion">Registrarse</button>
                    </form>

                    <p className="pie_autenticacion">
                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                    </p>
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default Register;
