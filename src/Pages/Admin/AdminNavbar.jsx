import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
    return (
        <nav className="admin-side-nav">
            <h3 className="admin-nav-title">Panel de Control</h3>
            <ul className="admin-nav-list">
                <li>
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                        Productos
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                        Usuarios
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                     Pedidos
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default AdminNavbar;
