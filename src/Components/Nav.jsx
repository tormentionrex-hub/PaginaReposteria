import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/Logo.png';
import '../Styles/Navbar.css';

function Nav() {
    // Lógica fuera del return
    const storageUser = localStorage.getItem("user");
    const userInfo = storageUser ? JSON.parse(storageUser) : null;
    const esAdmin = userInfo && (userInfo.rol === "admin" || userInfo.rol === "owner");

    function cerrarSesion() {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    return (
        <nav className="navegacion">
            <div className="contenedor_navegacion">
                <div className="logo_navegacion">
                    <Link to="/" className="enlace_logo">
                        <div className="contenedor_texto_logo">
                            <span className="titulo_logo">Repostería</span>
                            <span className="subtitulo_logo">Rosita</span>
                        </div>
                        <img src={Logo} alt="PgRosita Logo" className="imagen_logo" />
                    </Link>
                </div>

                <ul className="menu_navegacion">
                    <li className="item_navegacion">
                        <Link to="/" className="enlace_navegacion">Home</Link>
                    </li>
                    <li className="item_navegacion desplegable">
                        <span className="enlace_navegacion activador_desplegable">Productos</span>
                        <ul className="menu_desplegable">
                            <li><Link to="/queques" className="item_desplegable">Queques</Link></li>
                            <li><Link to="/galletas" className="item_desplegable">Galletas</Link></li>
                            <li><Link to="/tartas-de-fresa" className="item_desplegable">Tartas de Fresa</Link></li>
                            <li><Link to="/cupcakes-festivos" className="item_desplegable">Cupcakes Festivos</Link></li>
                            <li><Link to="/macarons-dulces" className="item_desplegable">Macarons Dulces</Link></li>
                        </ul>
                    </li>
                    <li className="item_navegacion">
                        <Link to="/ofertas" className="enlace_navegacion">Ofertas</Link>
                    </li>
                    <li className="item_navegacion">
                        <Link to="/sabores" className="enlace_navegacion">Sabores</Link>
                    </li>
                    {userInfo && (
                        <>
                            <li className="item_navegacion">
                                <Link to="/profile" className="enlace_navegacion">Mi Perfil</Link>
                            </li>
                            <li className="item_navegacion">
                                <Link to="/mis-pedidos" className="enlace_navegacion">Mis Pedidos</Link>
                            </li>
                        </>
                    )}
                    {esAdmin && (
                        <li className="item_navegacion">
                            <Link to="/admin" className="enlace_navegacion">Admin</Link>
                        </li>
                    )}
                </ul>

                <div className="acciones_navegacion">
                    {!userInfo ? (
                        <>
                            <Link to="/login" className="boton_login">Iniciar Sesión</Link>
                            <Link to="/register" className="boton_registro">Registrarse</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="info_usuario_nav" title="Ir a mi perfil">
                                <img
                                    src={userInfo.foto || "https://i.pinimg.com/736x/52/17/11/5217111bf01e03621b31bfd2abbdbb6a.jpg"}
                                    alt="Usuario"
                                    className="imagen_usuario_nav"
                                />
                                <div className="texto_usuario_nav">
                                    <p className="nombre_nav">{userInfo.name}</p>
                                    {(userInfo.rol === 'admin' || userInfo.rol === 'owner') && (
                                        <span className="rol_nav">{userInfo.rol === 'owner' ? 'Propietario' : 'Administrador'}</span>
                                    )}
                                </div>
                            </Link>
                            <button className="boton_salir" onClick={cerrarSesion}>
                                Salir
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Nav;
