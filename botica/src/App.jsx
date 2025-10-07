import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";

// 🔹 Pequeño componente interno para mostrar notificaciones simples
const Toaster = ({ message, type }) => {
  if (!message) return null;

  const baseStyle =
    "fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg text-white";
  const styles = {
    success: `${baseStyle} bg-green-600`,
    error: `${baseStyle} bg-red-600`,
    info: `${baseStyle} bg-blue-600`,
  };

  return <div className={styles[type] || styles.info}>{message}</div>;
};

// 🔹 TooltipProvider simplificado (solo renderiza los children)
const TooltipProvider = ({ children }) => <>{children}</>;

const queryClient = new QueryClient();

const App = () => {
  // Ejemplo de uso opcional de Toaster si luego quieres manejar notificaciones globales
  // const [toast, setToast] = useState({ message: "", type: "" });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {/* <Toaster message={toast.message} type={toast.type} /> */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book-appointment"
                element={
                  <ProtectedRoute allowedRoles={["paciente"]}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />
              {/* RUTA DE ERROR / NO ENCONTRADO */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
