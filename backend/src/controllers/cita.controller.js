// import * as from "../services/cita.service.js";
import {
  createCita,
  getAllCitas,
  getCitasByMedico,
  getCitasByPaciente,
  updateCitaEstado,
} from "../services/cita.service.js";

// Crear cita
export const addCita = async (req, res) => {
  try {
    const { medico_id, fecha, hora } = req.body;
    const paciente_id = req.user.id; // viene del token

    if (!medico_id || !fecha || !hora) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const cita = await createCita({
      paciente_id,
      medico_id,
      fecha,
      hora,
    });
    res.status(201).json({ message: "Cita registrada", cita });
  } catch (error) {
    console.error("Error addCita:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Listar citas de paciente
export const listCitasPaciente = async (req, res) => {
  try {
    const paciente_id = req.user.id;
    const citas = await getCitasByPaciente(paciente_id);
    res.json(citas);
  } catch (error) {
    console.error("Error listCitasPaciente:", error);
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

// Listar citas de médico
export const listCitasMedico = async (req, res) => {
  try {
    const medico_id = req.params.medico_id;
    const citas = await getCitasByMedico(medico_id);
    res.json(citas);
  } catch (error) {
    console.error("Error listCitasMedico:", error);
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

// Actualizar estado (ej: confirmar, cancelar, completar)
export const changeCitaEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (
      !["pendiente", "confirmada", "cancelada", "completada"].includes(estado)
    ) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const result = await updateCitaEstado(id, estado);
    res.json({ message: "Estado actualizado", result });
  } catch (error) {
    console.error("Error changeCitaEstado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};

// cita.controller.js (AGREGAR ESTO)
export const listAllCitas = async (req, res) => {
  try {
    const citas = await getAllCitas();
    res.json(citas);
  } catch (error) {
    console.error("Error listAllCitas:", error);
    res.status(500).json({ message: "Error al obtener todas las citas" });
  }
};
