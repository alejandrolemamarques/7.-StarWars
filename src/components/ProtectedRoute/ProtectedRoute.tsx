import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { User } from "firebase/auth";

// Define the props interface for the ProtectedRoute component
interface ProtectedRouteProps {
    user: User | null; // Current authenticated user
}

/**
 * ProtectedRoute Component
 *
 * This component acts as a guard for routes that require authentication.
 * It checks if a user is logged in and either:
 * - Redirects to the home page if no user is logged in
 * - Renders the child routes if a user is logged in
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user }) => {
    // If no user is logged in, redirect to the home page
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If user is logged in, render the child route components
    // Outlet is a special component from react-router-dom that renders
    // the matched child route
    return <Outlet />;
};

export default ProtectedRoute;

