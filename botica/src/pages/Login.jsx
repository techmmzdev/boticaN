/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/auth.js";
import { toast } from "sonner";
import { Stethoscope, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("¡Bienvenido de nuevo!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Credenciales inválidas. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-slate-800/60 backdrop-blur-2xl border border-slate-700/50 
                   rounded-3xl shadow-2xl p-8 space-y-8 relative z-10"
      >
        {/* Encabezado */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <motion.div
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.5 },
              }}
              className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/40"
            >
              <Stethoscope className="h-10 w-10 text-white" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-slate-400 text-base">
              Bienvenido a{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MediCitas
              </span>
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-semibold text-slate-300"
            >
              <Mail className="h-4 w-4 text-blue-400" />
              Correo Electrónico
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                         text-white placeholder-slate-500
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         outline-none disabled:bg-slate-900/30 disabled:text-slate-600 
                         transition-all duration-200"
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-semibold text-slate-300"
            >
              <Lock className="h-4 w-4 text-blue-400" />
              Contraseña
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                         text-white placeholder-slate-500
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         outline-none disabled:bg-slate-900/30 disabled:text-slate-600 
                         transition-all duration-200"
            />
          </div>

          {/* Enlace de "Olvidé mi contraseña" */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón de inicio */}
          <motion.button
            type="submit"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                       text-white font-bold text-lg
                       shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                       transition-all duration-300 flex items-center justify-center 
                       disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none 
                       disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </>
            )}
          </motion.button>
        </form>

        {/* Enlace de registro */}
        <div className="text-center text-sm mt-6 pt-6 border-t border-slate-700/50">
          <span className="text-slate-400">¿No tienes una cuenta?</span>{" "}
          <Link
            to="/register"
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors duration-200"
          >
            Regístrate aquí
          </Link>
        </div>

        {/* Decoración inferior */}
        <div className="flex justify-center gap-2 pt-2">
          <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
