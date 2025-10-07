import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/auth.js";
import { toast } from "sonner";
import { Stethoscope, User, Mail, Lock, UserCog } from "lucide-react";

const Register = () => {
  // Estados
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("paciente");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(nombre, apellido, email, password, rol);
      toast.success("¡Cuenta creada exitosamente!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Error al registrarse. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Encabezado */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-transform duration-300">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight mt-6 bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Crear Cuenta
          </h1>
          <p className="text-lg text-slate-400">
            Únete a MediCitas y gestiona tu salud
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <label
                  htmlFor="nombre"
                  className="text-sm font-semibold text-slate-300 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-blue-400" />
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Juan"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                             text-white placeholder-slate-500
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none 
                             disabled:bg-slate-900/30 disabled:text-slate-600 transition duration-200"
                />
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label
                  htmlFor="apellido"
                  className="text-sm font-semibold text-slate-300 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-blue-400" />
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  placeholder="Pérez"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                             text-white placeholder-slate-500
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none 
                             disabled:bg-slate-900/30 disabled:text-slate-600 transition duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-300 flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-blue-400" />
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                           text-white placeholder-slate-500
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none 
                           disabled:bg-slate-900/30 disabled:text-slate-600 transition duration-200"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-300 flex items-center gap-2"
              >
                <Lock className="h-4 w-4 text-blue-400" />
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                           text-white placeholder-slate-500
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none 
                           disabled:bg-slate-900/30 disabled:text-slate-600 transition duration-200"
              />
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <label
                htmlFor="rol"
                className="text-sm font-semibold text-slate-300 flex items-center gap-2"
              >
                <UserCog className="h-4 w-4 text-blue-400" />
                Tipo de Cuenta
              </label>
              <select
                id="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                           text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none 
                           disabled:bg-slate-900/30 disabled:text-slate-600 appearance-none transition duration-200
                           cursor-pointer"
              >
                <option value="paciente" className="bg-slate-900">
                  Paciente
                </option>
                <option value="medico" className="bg-slate-900">
                  Médico
                </option>
                <option value="admin" className="bg-slate-900">
                  Administrador
                </option>
              </select>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                         text-white font-bold text-lg
                         shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                         hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 
                         disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none 
                         disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          {/* Enlace al login */}
          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center text-sm">
            <span className="text-slate-400">¿Ya tienes una cuenta? </span>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>

        {/* Texto legal */}
        <p className="text-center text-xs text-slate-500 px-8">
          Al crear una cuenta, aceptas nuestros términos de servicio y política
          de privacidad
        </p>
      </div>
    </div>
  );
};

export default Register;
