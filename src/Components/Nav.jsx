import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import Logo from '../images/Logo.png';


function Nav() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" className="logo-link">
                        <div className="logo-text-container">
                            <span className="logo-title">Repostería</span>
                            <span className="logo-subtitle">Rosita</span>
                        </div>
                        <img src={Logo} alt="PgRosita Logo" className="logo-img" />
                    </Link>
                </div>

                {/* Centro: Enlaces principales de navegación */}
                <ul className="navbar-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/productos" className="nav-link">Productos</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/perfil" className="nav-link">Perfil</Link>
                    </li>
                </ul>

                {/* Lado derecho: Sesión y usuario */}
                <div className="navbar-actions">
                    <Link to="/login" className="btn-login">Iniciar Sesión</Link>
                    <Link to="/registro" className="btn-register">Registrarse</Link>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
