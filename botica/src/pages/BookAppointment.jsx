/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth.js";
import {
  ArrowLeft,
  Clock,
  Stethoscope,
  Calendar,
  User,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEspecialidades as getSpecialties } from "@/services/especialidad.js";
import { listMedicosByEspecialidad as getDoctorsBySpecialty } from "@/services/medico.js";
import { createCita } from "@/services/cita.js";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const BookAppointment = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const defaultSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Cargar especialidades
  const loadSpecialties = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getSpecialties(token);
      setSpecialties(data);
    } catch {
      toast.error("Error al cargar especialidades");
    }
  }, [token]);

  // Cargar médicos por especialidad
  const loadDoctors = useCallback(async () => {
    if (!token || !selectedSpecialty) return;
    try {
      const data = await getDoctorsBySpecialty(selectedSpecialty, token);
      setDoctors(data);
    } catch {
      toast.error("Error al cargar médicos");
    }
  }, [token, selectedSpecialty]);

  // Cargar horarios
  const loadAvailableSlots = useCallback(() => {
    if (selectedDoctor && selectedDate) {
      setAvailableSlots(defaultSlots);
    }
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    loadSpecialties();
  }, [loadSpecialties]);

  useEffect(() => {
    if (selectedSpecialty) loadDoctors();
  }, [selectedSpecialty, loadDoctors]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) loadAvailableSlots();
  }, [selectedDoctor, selectedDate, loadAvailableSlots]);

  // Enviar cita
  const handleSubmit = async () => {
    if (!token || !selectedDate || !selectedTime) return;
    setIsLoading(true);
    try {
      await createCita(token, {
        medico_id: selectedDoctor,
        fecha: format(new Date(selectedDate), "yyyy-MM-dd"),
        hora: selectedTime,
      });
      toast.success("¡Cita agendada exitosamente!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.message || "Error al agendar la cita");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedToStep2 = selectedSpecialty && selectedDoctor;
  const canProceedToStep3 = selectedDate;
  const canSubmit = selectedTime;

  // Obtener nombre de especialidad seleccionada
  const selectedSpecialtyName = specialties.find(
    (s) => s.id === selectedSpecialty
  )?.nombre;
  const selectedDoctorName = doctors.find(
    (d) => d.id === selectedDoctor
  )?.nombre;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-300" />
          </motion.button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/30">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Agendar Cita</h1>
              <p className="text-sm text-slate-400">
                Paso <span className="text-blue-400 font-semibold">{step}</span>{" "}
                de 3
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: step >= s ? 1 : 0.8,
                  backgroundColor:
                    step >= s ? "rgb(59, 130, 246)" : "rgb(51, 65, 85)",
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                  ${step >= s ? "shadow-lg shadow-blue-500/30" : ""}`}
              >
                {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
              </motion.div>
              {s < 3 && (
                <motion.div
                  className="flex-1 h-1 mx-2 rounded-full bg-slate-700"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: step > s ? 1 : 0,
                    backgroundColor:
                      step > s ? "rgb(59, 130, 246)" : "rgb(51, 65, 85)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6 relative z-10">
        {/* Step 1 */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                1. Especialidad y Médico
              </h2>
            </div>
            <p className="text-slate-400 mb-6">
              Elige la especialidad médica y el profesional
            </p>

            <div className="space-y-4">
              {/* Especialidad */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Stethoscope className="h-4 w-4 text-blue-400" />
                  Especialidad
                </label>
                <select
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-3 text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                             transition-all duration-200 appearance-none cursor-pointer"
                  value={selectedSpecialty}
                  onChange={(e) => {
                    setSelectedSpecialty(e.target.value);
                    setSelectedDoctor("");
                  }}
                >
                  <option value="" className="bg-slate-900">
                    Selecciona una especialidad
                  </option>
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900">
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Médico */}
              {selectedSpecialty && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <User className="h-4 w-4 text-purple-400" />
                    Médico
                  </label>
                  <select
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-3 text-white
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                               transition-all duration-200 appearance-none cursor-pointer"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                  >
                    <option value="" className="bg-slate-900">
                      Selecciona un médico
                    </option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id} className="bg-slate-900">
                        Dr. {d.nombre}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* Resumen de selección */}
              {selectedSpecialty && selectedDoctor && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
                >
                  <p className="text-sm text-slate-300">
                    <span className="text-blue-400 font-semibold">
                      Especialidad:
                    </span>{" "}
                    {selectedSpecialtyName}
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    <span className="text-purple-400 font-semibold">
                      Médico:
                    </span>{" "}
                    Dr. {selectedDoctorName}
                  </p>
                </motion.div>
              )}

              {canProceedToStep2 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl 
                             font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                             transition-all duration-300"
                >
                  Continuar al Paso 2
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step 2 */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                2. Selecciona Fecha
              </h2>
            </div>
            <p className="text-slate-400 mb-6">Elige el día para tu cita</p>

            <input
              type="date"
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-3 text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                         transition-all duration-200 cursor-pointer"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
              >
                <p className="text-slate-300">
                  <span className="text-blue-400 font-semibold">
                    Fecha seleccionada:
                  </span>{" "}
                  {format(
                    new Date(selectedDate),
                    "EEEE, d 'de' MMMM 'de' yyyy",
                    { locale: es }
                  )}
                </p>
              </motion.div>
            )}

            {canProceedToStep3 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(3)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 mt-4 rounded-xl 
                           font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                           transition-all duration-300"
              >
                Continuar al Paso 3
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Step 3 */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                3. Selecciona Horario
              </h2>
            </div>
            <p className="text-slate-400 mb-6">
              Horarios disponibles para el{" "}
              <span className="text-blue-400 font-semibold">
                {format(new Date(selectedDate), "d 'de' MMMM", { locale: es })}
              </span>
            </p>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {availableSlots.length === 0 ? (
                <p className="col-span-full text-center text-slate-400 py-8">
                  No hay horarios disponibles
                </p>
              ) : (
                availableSlots.map((slot, index) => (
                  <motion.button
                    key={slot}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3 px-2 rounded-xl border font-semibold transition-all duration-200
                      ${
                        selectedTime === slot
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                          : "bg-slate-900/50 text-slate-300 border-slate-600 hover:border-slate-500 hover:bg-slate-900"
                      }`}
                  >
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    {slot}
                  </motion.button>
                ))
              )}
            </div>

            {canSubmit && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 mt-6 rounded-xl 
                           font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40
                           transition-all duration-300 flex items-center justify-center gap-2
                           disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-6 w-6" />
                    Confirmar Cita
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BookAppointment;
