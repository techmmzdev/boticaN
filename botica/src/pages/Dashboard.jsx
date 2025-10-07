/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  LogOut,
  Plus,
  User,
  Stethoscope,
  Syringe,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/auth.js";
import { listMedicos } from "@/services/medico.js";
import { getAllEspecialidades } from "@/services/especialidad.js";
import {
  getCitasPaciente,
  getCitasMedico,
  getAllCitas,
  updateCitaEstado, // <<< 1. IMPORTACIÓN DEL SERVICIO DE ACTUALIZACIÓN
} from "@/services/cita.js";
import AddMedicoModal from "@/components/AddMedicoModal";
import AddEspecialidadModal from "@/components/AddEspecialidadModal";
import AddUsuarioModal from "@/components/AddUsuarioModal";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  // Estado de Datos
  const [appointments, setAppointments] = useState([]);
  const [medicosList, setMedicosList] = useState([]);
  const [especialidadesList, setEspecialidadesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado de Modales
  const [isMedicoModalOpen, setIsMedicoModalOpen] = useState(false);
  const [isEspecialidadModalOpen, setIsEspecialidadModalOpen] = useState(false);
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);

  // --------------------------------------------------------------------------
  // NUEVA FUNCIÓN: Manejar el cambio de estado de la cita (Confirmar/Cancelar)
  // --------------------------------------------------------------------------
  const handleChangeStatus = async (citaId, newStatus) => {
    try {
      await updateCitaEstado(token, citaId, newStatus);
      toast.success(
        `Cita ${
          newStatus === "confirmada" ? "confirmada" : "cancelada"
        } exitosamente.`
      );
      loadAppointments(); // Recargar las citas para actualizar la lista
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      toast.error(err?.message || "Error al cambiar el estado de la cita");
    }
  };

  // Cargar citas médicas
  const loadAppointments = useCallback(async () => {
    if (!token) return;
    try {
      let data = [];

      if (user?.rol === "paciente") {
        data = await getCitasPaciente(token);
      } else if (user?.rol === "medico") {
        // CORRECCIÓN CLAVE: Usando user.medico_id
        data = await getCitasMedico(token, user.medico_id);
      } else if (user?.rol === "admin") {
        data = await getAllCitas(token);
      }

      setAppointments(data);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error al cargar las citas");
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  // Cargar lista de médicos
  const loadMedicos = useCallback(async () => {
    if (user?.rol !== "admin") return;
    try {
      const data = await listMedicos();
      setMedicosList(data);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error al cargar la lista de médicos");
    }
  }, [user?.rol]);

  // Cargar lista de Especialidades
  const loadEspecialidades = useCallback(async () => {
    if (user?.rol !== "admin") return;
    try {
      const data = await getAllEspecialidades();
      setEspecialidadesList(data);
    } catch (err) {
      console.error(err);
    }
  }, [user?.rol]);

  // Efecto inicial
  useEffect(() => {
    loadAppointments();
    loadMedicos();
    loadEspecialidades();
  }, [loadAppointments, loadMedicos, loadEspecialidades]);

  // Cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Sesión cerrada exitosamente");
  };

  // Colores según estado de la cita
  const getStatusColor = (estado) => {
    switch (estado) {
      case "confirmada":
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
      case "pendiente":
        return "text-amber-400 bg-amber-500/20 border-amber-500/30";
      case "cancelada":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  // Icono según estado
  const getStatusIcon = (estado) => {
    switch (estado) {
      case "confirmada":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pendiente":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelada":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Calcular estadísticas
  const citasConfirmadas = appointments.filter(
    (a) => a.estado === "confirmada"
  ).length;
  const citasPendientes = appointments.filter(
    (a) => a.estado === "pendiente"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* HEADER */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/30">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MediCitas</h1>
              <p className="text-sm text-slate-400">
                Bienvenido,{" "}
                <span className="text-blue-400 font-semibold">
                  {user?.nombre}
                </span>
              </p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 
                       rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </motion.button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* PANEL ADMINISTRADOR */}
        {user?.rol === "admin" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <Activity className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                Panel de Administración
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Botón Registrar Médico */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsMedicoModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 
                           text-white py-4 px-6 rounded-xl shadow-lg shadow-purple-500/30 
                           hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 font-semibold"
              >
                <Stethoscope className="h-5 w-5" />
                Registrar Médico
              </motion.button>

              {/* Botón Crear Especialidad */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEspecialidadModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 
                           text-white py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 
                           hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-semibold"
              >
                <Syringe className="h-5 w-5" />
                Crear Especialidad
              </motion.button>

              {/* Botón Registrar Usuario */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUsuarioModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 
             text-white py-4 px-6 rounded-xl shadow-lg shadow-emerald-500/30 
             hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 font-semibold"
              >
                <User className="h-5 w-5" />
                Registrar Usuario
              </motion.button>

              {/* Estadística Médicos */}
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Médicos</span>
                  <Stethoscope className="h-5 w-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {medicosList.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">registrados</div>
              </div>

              {/* Estadística Especialidades */}
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Especialidades</span>
                  <Syringe className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {especialidadesList.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">disponibles</div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ESTADÍSTICAS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-3 mb-8"
        >
          {/* Card Rol */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 group hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-400">Tu Rol</span>
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <User className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold capitalize bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user?.rol}
            </div>
          </div>

          {/* Card Citas Totales */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 group hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-400">
                Citas Totales
              </span>
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">
              {appointments.length}
            </div>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-emerald-400">
                ✓ {citasConfirmadas} confirmadas
              </span>
              <span className="text-amber-400">
                ⏳ {citasPendientes} pendientes
              </span>
            </div>
          </div>

          {/* Card Estado */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 group hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-400">Estado</span>
              <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="text-3xl font-bold text-emerald-400">Activo</div>
            </div>
          </div>
        </motion.section>

        {/* AGENDAR NUEVA CITA (solo paciente) */}
        {user?.rol === "paciente" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/book-appointment")}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 
                         text-white py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 
                         hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-bold text-lg"
            >
              <Plus className="h-6 w-6" />
              Agendar Nueva Cita
            </motion.button>
          </motion.div>
        )}

        {/* LISTA DE CITAS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">
              {user?.rol === "paciente" ? "Mis Citas" : "Todas las Citas"}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No hay citas registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center p-4 bg-slate-900/50 border border-slate-700/50 
               rounded-xl hover:border-slate-600 transition-all duration-200 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <p className="font-semibold text-white text-lg">
                        {appointment.fecha} - {appointment.hora}
                      </p>
                    </div>

                    {/* Nombre del médico */}
                    {appointment.medico_nombre && (
                      <p className="text-sm text-slate-400 ml-7">
                        <span className="text-slate-500">Médico:</span>{" "}
                        {appointment.medico_nombre}{" "}
                        {appointment.medico_apellido}
                      </p>
                    )}

                    {/* Nombre del paciente, solo para médico o admin */}
                    {user?.rol !== "paciente" &&
                      appointment.paciente_nombre && (
                        <p className="text-sm text-slate-400 ml-7">
                          <span className="text-slate-500">Paciente:</span>{" "}
                          {appointment.paciente_nombre}{" "}
                          {appointment.paciente_apellido}
                        </p>
                      )}
                  </div>

                  {/* >>> BOTONES DE GESTIÓN Y ESTADO <<< */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                      capitalize border ${getStatusColor(appointment.estado)} 
                      transition-all duration-200`}
                    >
                      {getStatusIcon(appointment.estado)}
                      {appointment.estado}
                    </span>

                    {/* Botones de Acción (Solo si es médico y la cita está pendiente) */}
                    {user?.rol === "medico" &&
                      appointment.estado === "pendiente" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleChangeStatus(appointment.id, "confirmada")
                            }
                            className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            title="Confirmar Cita"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleChangeStatus(appointment.id, "cancelada")
                            }
                            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                            title="Cancelar Cita"
                          >
                            <XCircle className="h-5 w-5" />
                          </motion.button>
                        </>
                      )}
                  </div>
                  {/* ----------------------------------- */}
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {/* MODALES */}
      <AddMedicoModal
        isOpen={isMedicoModalOpen}
        onClose={() => setIsMedicoModalOpen(false)}
        onMedicoAdded={loadMedicos}
      />

      <AddEspecialidadModal
        isOpen={isEspecialidadModalOpen}
        onClose={() => setIsEspecialidadModalOpen(false)}
        onEspecialidadAdded={loadEspecialidades}
      />

      <AddUsuarioModal
        isOpen={isUsuarioModalOpen}
        onClose={() => setIsUsuarioModalOpen(false)}
        onUsuarioAdded={() => toast.success("Usuario agregado")}
      />
    </div>
  );
};

export default Dashboard;
