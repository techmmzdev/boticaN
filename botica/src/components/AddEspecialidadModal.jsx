/* eslint-disable no-unused-vars */
import { useState } from "react";
import { toast } from "sonner";
import { X, Syringe, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/auth.js";
import { addEspecialidad } from "@/services/especialidad.js";

const AddEspecialidadModal = ({ isOpen, onClose, onEspecialidadAdded }) => {
  const { token } = useAuth();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      return toast.error("El nombre de la especialidad es obligatorio.");
    }

    setIsLoading(true);
    try {
      await addEspecialidad(nombre, descripcion, token);
      toast.success(`Especialidad "${nombre}" creada exitosamente.`);

      setNombre("");
      setDescripcion("");
      onEspecialidadAdded();
      onClose();
    } catch (error) {
      toast.error(error.message || "Error al crear la especialidad.");
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
                       w-full max-w-md p-6 space-y-6 relative"
          >
            {/* Efectos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <Syringe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Crear Especialidad
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div className="space-y-2">
                <label
                  htmlFor="nombre"
                  className="text-sm font-semibold text-slate-300 flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  Nombre de la Especialidad
                </label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Cardiología"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                             text-white placeholder-slate-500
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                             disabled:bg-slate-900/30 disabled:text-slate-600 transition-all duration-200"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label
                  htmlFor="descripcion"
                  className="text-sm font-semibold text-slate-300 flex items-center gap-2"
                >
                  <Syringe className="h-4 w-4 text-cyan-400" />
                  Descripción{" "}
                  <span className="text-slate-500 text-xs">(Opcional)</span>
                </label>
                <textarea
                  id="descripcion"
                  placeholder="Detalles sobre esta área médica..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={isLoading}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                             text-white placeholder-slate-500
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                             disabled:bg-slate-900/30 disabled:text-slate-600 transition-all duration-200 
                             resize-none"
                />
              </div>

              {/* Preview */}
              {nombre.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
                >
                  <p className="text-sm text-slate-400 mb-1">Vista previa:</p>
                  <p className="text-white font-semibold">{nombre}</p>
                  {descripcion && (
                    <p className="text-slate-400 text-sm mt-1">{descripcion}</p>
                  )}
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
                  whileHover={{ scale: isLoading || !nombre.trim() ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading || !nombre.trim() ? 1 : 0.98 }}
                  disabled={isLoading || !nombre.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 
                             text-white font-bold shadow-lg shadow-blue-500/30 
                             hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300
                             disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none 
                             disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Crear Especialidad
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

export default AddEspecialidadModal;
