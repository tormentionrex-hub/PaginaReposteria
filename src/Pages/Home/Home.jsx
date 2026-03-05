import React from 'react';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import enviosImg from '../../images/Envios.png';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            {/* Recuperamos el fondo difuminado */}
            <div className="home-background"></div>

            <Nav />

            {/* Layout de recuadros idéntico a la imagen mostrada */}
            <div className="bento-grid">

                {/* === Columna 1 (Izquierda) === */}
                <div className="bento-col">
                    <div className="bento-card">
                        <img src="https://sugarbakerscr.com/wp-content/uploads/2026/03/ChatGPT-Image-3-mar-2026-19_09_18.png" alt="Queques" className="bento-img tall-img" />
                        <div className="bento-label">Queques</div>
                    </div>
                    {/* Tarjeta extra en Izquierda (Corta) */}
                    <div className="bento-card">
                        <img src="https://i.pinimg.com/1200x/f8/19/e8/f819e87fd61fc60b14e62c2b5f838f1c.jpg" alt="Combos Familiares" className="bento-img short-img" />
                        <div className="bento-label">Combos Familiares</div>
                    </div>
                    {/* Tarjeta extra en Izquierda (Alta) */}
                    <div className="bento-card">
                        <img src="https://i.pinimg.com/1200x/8f/75/72/8f7572e2822d0f47e14773cedef055a2.jpg" alt="Decoración Personalizada" className="bento-img tall-img" />
                        <div className="bento-label">Decoración Personalizada</div>
                    </div>
                </div>

                {/* === Columna 2 (Centro) === */}
                <div className="bento-col">
                    {/* Tarjeta superior central más corta */}
                    <div className="bento-card">
                        <img src="https://sugarbakerscr.com/wp-content/uploads/2026/03/ChatGPT-Image-3-mar-2026-19_15_14.png" alt="Especiales del Mes" className="bento-img short-img" />
                        <div className="bento-label">Especiales del Mes</div>
                    </div>
                    {/* Tarjeta extra del usuario (Galletas) */}
                    <div className="bento-card">
                        <img src="https://i.pinimg.com/736x/d3/c9/fa/d3c9fab637744dfa2794deb3ed8450e4.jpg" alt="Galletas Clásicas" className="bento-img tall-img" />
                        <div className="bento-label">Galletas</div>
                    </div>
                    {/* Tarjeta extra nueva 1: Tartas */}
                    <div className="bento-card">
                        <img src="https://i.pinimg.com/736x/e5/cd/1d/e5cd1d0e86d1039493a1d8bc449c6781.jpg" alt="Tartas de Fresa" className="bento-img tall-img" />
                        <div className="bento-label">Tartas de Fresa</div>
                    </div>
                </div>

                {/* === Columna 3 (Derecha) === */}
                <div className="bento-col">
                    <div className="bento-card">
                        <img src="https://i.pinimg.com/736x/f1/67/94/f16794fe6aaf4a16fd42703a2136f650.jpg" alt="Envíos Cuidados" className="bento-img tall-img" />
                        <div className="bento-label">Envíos Cuidados</div>
                    </div>
                    {/* Tarjeta extra nueva 2: Cupcakes */}
                    <div className="bento-card">
                        <img src="https://i.pinimg.com/736x/fa/f8/d9/faf8d9aa46ad73ccd9106b0df6ba0a62.jpg" alt="Cupcakes Festivos" className="bento-img short-img" />
                        <div className="bento-label">Cupcakes Festivos</div>
                    </div>
                    {/* Tarjeta extra nueva 3: Macarons */}
                    <div className="bento-card">
                        <img src="https://i.pinimg.com/736x/c1/5c/d6/c15cd6ad6e2d7159157e268a86c82bda.jpg" alt="Macarons" className="bento-img tall-img" />
                        <div className="bento-label">Macarons Dulces</div>
                    </div>
                </div>

            </div>

            {/* ==== SECCIÓN CTA (Call To Action - Envíos por Correos de CR) ==== */}
            <div className="home-cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">
                        ¡Pide tus Chunky Cookies! <span>Tenemos envios Express</span>
                    </h2>
                    <p className="cta-subtitle">
                        Ya disponible para lugares fuera del GAM
                    </p>
                    <button className="cta-btn">
                        ¡PEDIR YA!
                    </button>
                </div>

                {/* Nuevo recuadro para imagen llamativa */}
                <div className="cta-image-container">
                    <img src={enviosImg} alt="Envíos por Correos" className="cta-image" />
                </div>
            </div>

            {/* ==== SECCIÓN MENÚ DE ICONOS INTERACTIVO ==== */}
            <div className="home-menu-section">
                <h2 className="menu-header">Menú</h2>
                <div className="menu-icon-grid">

                    <div className="menu-item">
                        <div className="menu-icon-box">
                            {/* Icono CUPCAKE referenciado desde Flaticon/Freepik mediante su ID */}
                            <img src="https://cdn-icons-png.flaticon.com/512/174/174394.png" alt="Cupcakes Festivos" style={{ width: '70px', height: '70px', opacity: 0.85 }} />
                        </div>
                        <span className="menu-text">Cupcakes Festivos</span>
                    </div>

                    <div className="menu-item">
                        <div className="menu-icon-box">
                            <img src="https://cdn-icons-png.flaticon.com/512/1923/1923564.png" alt="Macarons Dulces" style={{ width: '70px', height: '70px', opacity: 0.85 }} />
                        </div>
                        <span className="menu-text">Macarons Dulces</span>
                    </div>

                    <div className="menu-item">
                        <div className="menu-icon-box">
                            <img src="https://cdn-icons-png.flaticon.com/512/4932/4932982.png" alt="Decoración Especial" style={{ width: '70px', height: '70px', opacity: 0.85 }} />
                        </div>
                        <span className="menu-text">Decoración Especial</span>
                    </div>

                    <div className="menu-item">
                        <div className="menu-icon-box">
                            <img src="https://cdn-icons-png.flaticon.com/512/3615/3615226.png" alt="Combos Familiares" style={{ width: '70px', height: '70px', opacity: 0.85 }} />
                        </div>
                        <span className="menu-text">Combos Familiares</span>
                    </div>

                    <div className="menu-item">
                        <div className="menu-icon-box">
                            {/* Icono FRESA referenciado desde Flaticon/Freepik mediante su ID */}
                            <img src="https://cdn-icons-png.flaticon.com/512/8714/8714174.png" alt="Tartas Fresa" style={{ width: '70px', height: '70px', opacity: 0.85 }} />
                        </div>
                        <span className="menu-text">Tartas de Fresa</span>
                    </div>

                    <div className="menu-item">
                        <div className="menu-icon-box">
                            <img src="https://cdn-icons-png.flaticon.com/512/3778/3778146.png" alt="Galletas Clásicas" style={{ width: '70px', height: '70px', opacity: 0.85 }} />
                        </div>
                        <span className="menu-text">Galletas Clásicas</span>
                    </div>

                    <div className="menu-item">
                        <div className="menu-icon-box">
                            <img src="https://cdn-icons-png.flaticon.com/512/4147/4147498.png" alt="Queques" style={{ width: '70px', height: '70px', opacity: 0.85 }} />
                        </div>
                        <span className="menu-text">Queques</span>
                    </div>

                </div>
            </div>

            <Fooder />
        </div>
    );
}

export default Home;