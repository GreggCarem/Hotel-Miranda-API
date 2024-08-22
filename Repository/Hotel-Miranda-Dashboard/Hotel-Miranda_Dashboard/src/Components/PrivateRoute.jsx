import { Navigate } from "react-router-dom";
import { useAuth } from "./Redux/authContext";

const PrivateRoute = ({ children }) => {
  const { state } = useAuth();
  return state.isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
