import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { MainLayout } from "./MainLayout";

function ProtectedLayout() {
  const location = useLocation();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  };

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export { ProtectedLayout };