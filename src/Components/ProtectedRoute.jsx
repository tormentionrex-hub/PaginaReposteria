import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const loggedUser = localStorage.getItem("user");

    if (!loggedUser) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(loggedUser);

    if (!allowedRoles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
