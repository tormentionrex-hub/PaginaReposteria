import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ServicesUsers from '../../Services/ServicesUsers';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import '../Register/Register.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // --- Lógica de Componente ---

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'No se permiten datos vacíos ni espacios en blanco.',
            });
            return;
        }

        try {
            const usuarios = await ServicesUsers.getUsers();
            const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

            if (usuarioEncontrado) {
                localStorage.setItem("user", JSON.stringify(usuarioEncontrado));
                Swal.fire({
                    icon: 'success',
                    title: `¡Bienvenido/a, ${usuarioEncontrado.nombre}!`,
                    timer: 1500,
                    showConfirmButton: false
                });

                if (usuarioEncontrado.rol === 'admin' || usuarioEncontrado.rol === 'owner') {
                    navigate('/admin');
                } else {
                    navigate('/profile');
                }
            } else {
                setError("Correo o contraseña incorrectos.");
            }
        } catch (err) {
            setError("Error de conexión. Inténtalo más tarde.");
        }
    }

    return (
        <div className="contenedor_pagina">
            <div className="fondo_principal"></div>
            <Nav />
            <div className="contenido_autenticacion">
                <div className="tarjeta_autenticacion">
                    <h2 className="titulo_autenticacion">Iniciar Sesión</h2>
                    <p className="subtitulo_autenticacion">¡Qué alegría verte de nuevo!</p>

                    <form onSubmit={handleLogin} className="formulario_autenticacion">
                        <div className="grupo_entrada">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
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

                        <button type="submit" className="boton_autenticacion">Entrar</button>
                    </form>

                    <p className="pie_autenticacion">
                        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                    </p>
                </div>
            </div>
            <Fooder />
        </div>
    );
}

export default Login;
