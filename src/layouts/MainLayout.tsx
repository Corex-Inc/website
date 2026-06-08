import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header"

function MainLayout() {
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
    <div className="app-layout">
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export { MainLayout };