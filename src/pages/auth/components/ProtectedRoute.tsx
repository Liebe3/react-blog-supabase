import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";

import Loading from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) return <Loading />;

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return <div>{children}</div>;
};

export const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) return <Loading />;

  if (user) {
    return <Navigate to="/" replace />;
  }
  return <div> {children}</div>;
};
