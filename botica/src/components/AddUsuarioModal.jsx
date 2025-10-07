/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Mail, Lock, UserCog } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth.js";

const AddUsuarioModal = ({ isOpen, onClose, onUsuarioAdded }) => {
  const { adminRegisterUser } = useAuth();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("paciente");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 🚀 Usamos la nueva función que no sobrescribe la sesión.
      await adminRegisterUser(nombre, apellido, email, password, rol);

      toast.success("Usuario creado correctamente");
      onUsuarioAdded?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Error al crear usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg text-white relative"
          >
            {/* Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <UserPlus className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Registrar Usuario</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre y apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 flex items-center gap-1 mb-1">
                    <UserCog className="h-4 w-4 text-blue-400" />
                    Nombre
                  </label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 flex items-center gap-1 mb-1">
                    <UserCog className="h-4 w-4 text-blue-400" />
                    Apellido
                  </label>
                  <input
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-slate-300 flex items-center gap-1 mb-1">
                  <Mail className="h-4 w-4 text-blue-400" />
                  Correo
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="text-sm text-slate-300 flex items-center gap-1 mb-1">
                  <Lock className="h-4 w-4 text-blue-400" />
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  minLength={6}
                />
              </div>

              {/* Rol */}
              <div>
                <label className="text-sm text-slate-300 flex items-center gap-1 mb-1">
                  <UserCog className="h-4 w-4 text-blue-400" />
                  Rol
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="paciente">Paciente</option>
                  <option value="medico">Médico</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:opacity-90 transition"
              >
                {isLoading ? "Creando..." : "Registrar Usuario"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddUsuarioModal;
