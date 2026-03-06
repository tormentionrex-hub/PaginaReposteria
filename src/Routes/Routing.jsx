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
import ProductoDetalle from "../Pages/ProductoDetalle/ProductoDetalle"
import ProtectedRoute from "../Components/ProtectedRoute"

const Routing = () => {
    return (

        <Router>
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
                            <MostrarProducts />
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
                <Route path="/producto" element={<ProductoDetalle />} />
            </Routes>
        </Router>

    )
}

export default Routing