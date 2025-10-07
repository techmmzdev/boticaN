import * as horarioService from "../services/horario.service.js";

// Crear horario
export const addHorario = async (req, res) => {
  try {
    const { medico_id, dia_semana, hora_inicio, hora_fin } = req.body;

    if (!medico_id || !dia_semana || !hora_inicio || !hora_fin) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const horario = await horarioService.createHorario({
      medico_id,
      dia_semana,
      hora_inicio,
      hora_fin,
    });
    res.status(201).json({ message: "Horario registrado", horario });
  } catch (error) {
    console.error("Error addHorario:", error);
    res.status(500).json({ message: "Error al registrar horario" });
  }
};

// Listar horarios por médico
export const listHorariosByMedico = async (req, res) => {
  try {
    const { medico_id } = req.params;
    const horarios = await horarioService.getHorariosByMedico(medico_id);
    res.json(horarios);
  } catch (error) {
    console.error("Error listHorariosByMedico:", error);
    res.status(500).json({ message: "Error al obtener horarios" });
  }
};

// Eliminar horario
export const removeHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await horarioService.deleteHorario(id);
    res.json(result);
  } catch (error) {
    console.error("Error removeHorario:", error);
    res.status(500).json({ message: "Error al eliminar horario" });
  }
};
