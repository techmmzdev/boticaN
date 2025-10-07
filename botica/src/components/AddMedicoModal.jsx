/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Stethoscope, X, UserCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { addMedico } from "@/services/medico.js";
import { getAllUsers } from "@/services/authService.js";
import { getAllEspecialidades } from "@/services/especialidad.js";
import { useAuth } from "@/hooks/auth.js";

const AddMedicoModal = ({ isOpen, onClose, onMedicoAdded }) => {
  const { token } = useAuth();
  const [medicoUsers, setMedicoUsers] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedEspecialidadId, setSelectedEspecialidadId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos necesarios
  useEffect(() => {
    if (!isOpen || !token) return;

    const fetchData = async () => {
      try {
        const users = await getAllUsers(token);
        setMedicoUsers(users.filter((u) => u.rol === "medico"));

        const especialidadesData = await getAllEspecialidades();
        setEspecialidades(especialidadesData);
      } catch (error) {
        toast.error("Error al cargar datos: " + error.message);
      }
    };

    fetchData();
  }, [isOpen, token]);

  // Manejar el envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedEspecialidadId) {
      return toast.error("Debe seleccionar un usuario y una especialidad.");
    }

    setIsLoading(true);
    try {
      await addMedico(selectedUserId, selectedEspecialidadId);
      toast.success("¡Médico registrado exitosamente!");

      onMedicoAdded();
      onClose();
    } catch (error) {
      toast.error(error.message || "Error al registrar el médico.");
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener nombres para preview
  const selectedUser = medicoUsers.find((u) => u.id === selectedUserId);
  const selectedEspecialidad = especialidades.find(
    (e) => e.id === selectedEspecialidadId
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl 
                       w-full max-w-lg p-6 space-y-6 relative"
          >
            {/* Efectos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -z-10"></div>

            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Registrar Médico
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selector de Usuario */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-400" />
                  Usuario (Rol: Médico)
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  required
                  disabled={isLoading || medicoUsers.length === 0}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                             text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none
                             disabled:bg-slate-900/30 disabled:text-slate-600 transition-all duration-200
                             appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900">
                    Selecciona un usuario médico
                  </option>
                  {medicoUsers.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                      className="bg-slate-900"
                    >
                      {user.nombre} {user.apellido} ({user.email})
                    </option>
                  ))}
                </select>
                {medicoUsers.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-400 mt-2 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                  >
                    <span className="text-lg">⚠️</span>
                    No hay usuarios con rol 'médico' disponibles.
                  </motion.p>
                )}
              </div>

              {/* Selector de Especialidad */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-400" />
                  Especialidad
                </label>
                <select
                  value={selectedEspecialidadId}
                  onChange={(e) => setSelectedEspecialidadId(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                             text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none
                             disabled:bg-slate-900/30 disabled:text-slate-600 transition-all duration-200
                             appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900">
                    Selecciona una especialidad
                  </option>
                  {especialidades.map((esp) => (
                    <option
                      key={esp.id}
                      value={esp.id}
                      className="bg-slate-900"
                    >
                      {esp.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {selectedUserId && selectedEspecialidadId && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2"
                >
                  <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Vista previa del registro:
                  </p>
                  <div className="space-y-1">
                    <p className="text-white font-semibold">
                      Dr. {selectedUser?.nombre} {selectedUser?.apellido}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {selectedUser?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50">
                      <Sparkles className="h-4 w-4 text-pink-400" />
                      <p className="text-pink-400 font-semibold text-sm">
                        {selectedEspecialidad?.nombre}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-700/50 border border-slate-600 
                             text-slate-300 font-semibold hover:bg-slate-700 transition-all duration-200"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale:
                      isLoading || !selectedUserId || !selectedEspecialidadId
                        ? 1
                        : 1.02,
                  }}
                  whileTap={{
                    scale:
                      isLoading || !selectedUserId || !selectedEspecialidadId
                        ? 1
                        : 0.98,
                  }}
                  disabled={
                    isLoading || !selectedUserId || !selectedEspecialidadId
                  }
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 
                             text-white font-bold shadow-lg shadow-purple-500/30 
                             hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300
                             disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none 
                             disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Asociando...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-5 w-5" />
                      Asociar Médico
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMedicoModal;
