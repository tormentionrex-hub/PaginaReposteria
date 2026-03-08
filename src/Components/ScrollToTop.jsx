import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; //ESTO FUNCIONA PARA QUE CADA VEZ QUE ALGUIEN QUIERA IR A OTRA PAGINA LE MUESTRE LA INFO DESDE LA PARTE DE ARRIBA 
};

export default ScrollToTop;
