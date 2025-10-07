import * as medicoService from "../services/medico.service.js";

// Crear médico (asociar user -> especialidad)
export const addMedico = async (req, res) => {
  try {
    const { user_id, especialidad_id } = req.body;

    if (!user_id || !especialidad_id) {
      return res
        .status(400)
        .json({ message: "user_id y especialidad_id son obligatorios" });
    }

    const medico = await medicoService.createMedico({
      user_id,
      especialidad_id,
    });
    res.status(201).json({ message: "Médico registrado", medico });
  } catch (error) {
    console.error("Error addMedico:", error);
    res.status(500).json({ message: "Error al registrar médico" });
  }
};

// Listar todos los médicos
export const listMedicos = async (req, res) => {
  try {
    const medicos = await medicoService.getMedicos();
    res.json(medicos);
  } catch (error) {
    console.error("Error listMedicos:", error);
    res.status(500).json({ message: "Error al obtener médicos" });
  }
};

// Listar médicos por especialidad
export const listMedicosByEspecialidad = async (req, res) => {
  try {
    const { especialidad_id } = req.params;
    const medicos = await medicoService.getMedicosByEspecialidad(
      especialidad_id
    );
    res.json(medicos);
  } catch (error) {
    console.error("Error listMedicosByEspecialidad:", error);
    res.status(500).json({ message: "Error al obtener médicos" });
  }
};
