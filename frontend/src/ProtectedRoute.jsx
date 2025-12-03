import { Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Ładowanie...</div>;

  if (!user) return <Navigate to="/" replace />;

  return children;
}
