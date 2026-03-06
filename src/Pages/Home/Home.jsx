import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../Components/Nav';
import Fooder from '../../Components/Fooder';
import enviosImg from '../../images/Envios.png';
import './Home.css';

function Home() {
    return (
        <div className="contenedor_principal">
            <div className="fondo_principal"></div>

            <Nav />

            <div className="grid_bento">
                {/* Columna 1 */}
                <div className="columna_bento">
                    <Link to="/queques" className="tarjeta_bento">
                        <img src="https://sugarbakerscr.com/wp-content/uploads/2026/03/ChatGPT-Image-3-mar-2026-19_09_18.png" alt="Queques" className="imagen_bento imagen_alta" />
                        <div className="etiqueta_bento">Queques</div>
                    </Link>
                    <Link to="/combos-familiares" className="tarjeta_bento">
                        <img src="https://i.pinimg.com/1200x/f8/19/e8/f819e87fd61fc60b14e62c2b5f838f1c.jpg" alt="Combos Familiares" className="imagen_bento imagen_corta" />
                        <div className="etiqueta_bento">Combos Familiares</div>
                    </Link>
                    <Link to="/decoracion-personalizada" className="tarjeta_bento">
                        <img src="https://i.pinimg.com/1200x/8f/75/72/8f7572e2822d0f47e14773cedef055a2.jpg" alt="Decoración Personalizada" className="imagen_bento imagen_alta" />
                        <div className="etiqueta_bento">Decoración Personalizada</div>
                    </Link>
                </div>

                {/* Columna 2 */}
                <div className="columna_bento">
                    <Link to="/especiales-del-mes" className="tarjeta_bento">
                        <img src="https://sugarbakerscr.com/wp-content/uploads/2026/03/ChatGPT-Image-3-mar-2026-19_15_14.png" alt="Especiales del Mes" className="imagen_bento imagen_corta" />
                        <div className="etiqueta_bento">Especiales del Mes</div>
                    </Link>
                    <Link to="/galletas" className="tarjeta_bento">
                        <img src="https://i.pinimg.com/736x/d3/c9/fa/d3c9fab637744dfa2794deb3ed8450e4.jpg" alt="Galletas Clásicas" className="imagen_bento imagen_alta" />
                        <div className="etiqueta_bento">Galletas</div>
                    </Link>
                    <Link to="/tartas-de-fresa" className="tarjeta_bento">
                        <img src="https://i.pinimg.com/736x/e5/cd/1d/e5cd1d0e86d1039493a1d8bc449c6781.jpg" alt="Tartas de Fresa" className="imagen_bento imagen_alta" />
                        <div className="etiqueta_bento">Tartas de Fresa</div>
                    </Link>
                </div>

                {/* Columna 3 */}
                <div className="columna_bento">
                    <div className="tarjeta_bento">
                        <img src="https://i.pinimg.com/736x/f1/67/94/f16794fe6aaf4a16fd42703a2136f650.jpg" alt="Envíos Cuidados" className="imagen_bento imagen_alta" />
                        <div className="etiqueta_bento">Envíos Cuidados</div>
                    </div>
                    <Link to="/cupcakes-festivos" className="tarjeta_bento">
                        <img src="https://i.pinimg.com/736x/fa/f8/d9/faf8d9aa46ad73ccd9106b0df6ba0a62.jpg" alt="Cupcakes Festivos" className="imagen_bento imagen_corta" />
                        <div className="etiqueta_bento">Cupcakes Festivos</div>
                    </Link>
                    <Link to="/macarons-dulces" className="tarjeta_bento">
                        <img src="https://i.pinimg.com/736x/c1/5c/d6/c15cd6ad6e2d7159157e268a86c82bda.jpg" alt="Macarons" className="imagen_bento imagen_alta" />
                        <div className="etiqueta_bento">Macarons Dulces</div>
                    </Link>
                </div>
            </div>

            {/* SECCIÓN ANUNCIO */}
            <div className="seccion_anuncio">
                <div className="contenido_anuncio">
                    <h2 className="titulo_anuncio">
                        ¡Pide tus Chunky Cookies! <span>Tenemos envíos Express</span>
                    </h2>
                    <p className="subtitulo_anuncio">
                        Ya disponible para lugares fuera del GAM
                    </p>
                    <button className="boton_anuncio">
                        ¡PEDIR YA!
                    </button>
                </div>
                <div className="imagen_contenedor_anuncio">
                    <img src={enviosImg} alt="Envíos por Correos" className="imagen_anuncio" />
                </div>
            </div>

            {/* SECCIÓN MENÚ */}
            <div className="seccion_menu">
                <h2 className="titulo_menu">Menú</h2>
                <div className="grid_iconos_menu">
                    <Link to="/cupcakes-festivos" className="item_menu">
                        <div className="caja_icono_menu">
                            <img src="https://cdn-icons-png.flaticon.com/512/174/174394.png" alt="Cupcakes Festivos" />
                        </div>
                        <span className="texto_menu">Cupcakes Festivos</span>
                    </Link>

                    <Link to="/macarons-dulces" className="item_menu">
                        <div className="caja_icono_menu">
                            <img src="https://cdn-icons-png.flaticon.com/512/1923/1923564.png" alt="Macarons Dulces" />
                        </div>
                        <span className="texto_menu">Macarons Dulces</span>
                    </Link>

                    <Link to="/decoracion-personalizada" className="item_menu">
                        <div className="caja_icono_menu">
                            <img src="https://cdn-icons-png.flaticon.com/512/4932/4932982.png" alt="Decoración Especial" />
                        </div>
                        <span className="texto_menu">Decoración Especial</span>
                    </Link>

                    <Link to="/combos-familiares" className="item_menu">
                        <div className="caja_icono_menu">
                            <img src="https://cdn-icons-png.flaticon.com/512/3615/3615226.png" alt="Combos Familiares" />
                        </div>
                        <span className="texto_menu">Combos Familiares</span>
                    </Link>

                    <Link to="/tartas-de-fresa" className="item_menu">
                        <div className="caja_icono_menu">
                            <img src="https://cdn-icons-png.flaticon.com/512/8714/8714174.png" alt="Tartas Fresa" />
                        </div>
                        <span className="texto_menu">Tartas de Fresa</span>
                    </Link>

                    <Link to="/galletas" className="item_menu">
                        <div className="caja_icono_menu">
                            <img src="https://cdn-icons-png.flaticon.com/512/3778/3778146.png" alt="Galletas Clásicas" />
                        </div>
                        <span className="texto_menu">Galletas Clásicas</span>
                    </Link>

                    <Link to="/queques" className="item_menu">
                        <div className="caja_icono_menu">
                            <img src="https://cdn-icons-png.flaticon.com/512/4147/4147498.png" alt="Queques" />
                        </div>
                        <span className="texto_menu">Queques</span>
                    </Link>
                </div>
            </div>

            <Fooder />
        </div>
    );
}

export default Home;
