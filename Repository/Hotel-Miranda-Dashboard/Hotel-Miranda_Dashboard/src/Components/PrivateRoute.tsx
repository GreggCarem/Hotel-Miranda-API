import React from "react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Redux/authContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { state } = useAuth();

  return state.isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
