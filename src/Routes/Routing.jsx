import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "../Pages/Home/Home"
import Queques from "../Pages/Queques/Queques"
import CombosFamiliares from "../Pages/CombosFamiliares/CombosFamiliares"
import DecoracionPersonalizada from "../Pages/DecoracionPersonalizada/DecoracionPersonalizada"
import EspecialesDelMes from "../Pages/EspecialesDelMes/EspecialesDelMes"
import Galletas from "../Pages/Galletas/Galletas"
import TartasDeFresa from "../Pages/TartasDeFresa/TartasDeFresa"
import CupcakesFestivos from "../Pages/CupcakesFestivos/CupcakesFestivos"
import MacaronsDulces from "../Pages/MacaronsDulces/MacaronsDulces"
import Login from "../Pages/Login/Login"
import Register from "../Pages/Register/Register"
import MostrarProducts from "../Pages/Admin/MostrarProducts"
import AdminUsers from "../Pages/Admin/AdminUsers"
import AdminOrders from "../Pages/Admin/AdminOrders"
import Profile from "../Pages/Profile/Profile"
import Ordenes from "../Pages/Ordenes/Ordenes"
import ProductoDetalle from "../Pages/ProductoDetalle/ProductoDetalle"
import Ofertas from "../Pages/Ofertas/Ofertas"
import Sabores from "../Pages/Sabores/Sabores"
import ProtectedRoute from "../Components/ProtectedRoute"
import ScrollToTop from "../Components/ScrollToTop"

const Routing = () => {
    return (

        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/queques" element={<Queques />} />
                <Route path="/combos-familiares" element={<CombosFamiliares />} />
                <Route path="/decoracion-personalizada" element={<DecoracionPersonalizada />} />
                <Route path="/especiales-del-mes" element={<EspecialesDelMes />} />
                <Route path="/galletas" element={<Galletas />} />
                <Route path="/tartas-de-fresa" element={<TartasDeFresa />} />
                <Route path="/cupcakes-festivos" element={<CupcakesFestivos />} />
                <Route path="/macarons-dulces" element={<MacaronsDulces />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'owner']}>
                            <MostrarProducts type="productos" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/offers"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'owner']}>
                            <MostrarProducts type="ofertas" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/flavors"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'owner']}>
                            <MostrarProducts type="sabores" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'owner']}>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'owner']}>
                            <AdminOrders />
                        </ProtectedRoute>
                    }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/mis-pedidos" element={<Ordenes />} />
                <Route path="/producto" element={<ProductoDetalle />} />
                <Route path="/ofertas" element={<Ofertas />} />
                <Route path="/sabores" element={<Sabores />} />
            </Routes>
        </Router>

    )
}

export default Routing