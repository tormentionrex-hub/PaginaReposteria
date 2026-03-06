import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Logo from '../../images/Logo.png';
import './AdminHeader.css';

function AdminHeader() {
    const navigate = useNavigate();
    const storageUser = localStorage.getItem("user");
    const user = storageUser ? JSON.parse(storageUser) : {};

    function salirAlSitio() {
        navigate('/');
    }

    function irAlAdmin() {
        navigate('/admin');
    }

    return (
        <header className="cabecera_admin">
            <div className="izquierda_cabecera_admin">
                <div className="logo_admin" onClick={irAlAdmin}>
                    <img src={Logo} alt="Logo Rosita" className="imagen_logo_admin" />
                    <div className="texto_logo_admin">
                        <h4>Panel Administrativo</h4>
                        <span>Sistema de Gestión</span>
                    </div>
                </div>

                <nav className="navegacion_admin">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? "enlace_navegacion_admin activo" : "enlace_navegacion_admin"}>
                        Productos
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? "enlace_navegacion_admin activo" : "enlace_navegacion_admin"}>
                        Usuarios
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "enlace_navegacion_admin activo" : "enlace_navegacion_admin"}>
                        Pedidos
                    </NavLink>
                </nav>
            </div>

            <div className="derecha_cabecera_admin">
                <div className="info_usuario_admin">
                    <img
                        src={user.foto || "https://i.pinimg.com/736x/52/17/11/5217111bf01e03621b31bfd2abbdbb6a.jpg"}
                        alt="Usuario"
                        className="imagen_usuario_admin"
                    />
                    <div className="texto_usuario_admin">
                        <p>{user.nombre || 'Administrador'}</p>
                        <span>{user.rol === 'owner' ? 'Propietario' : 'Administrador'}</span>
                    </div>
                </div>
                <button className="boton_salir_admin" onClick={salirAlSitio}>
                    Salir al Sitio 🌐
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;
