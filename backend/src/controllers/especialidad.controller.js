import * as especialidadService from "../services/especialidad.service.js";

// Crear
export const addEspecialidad = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre)
      return res.status(400).json({ message: "El nombre es obligatorio" });

    const especialidad = await especialidadService.createEspecialidad({
      nombre,
      descripcion,
    });
    res.status(201).json({ message: "Especialidad creada", especialidad });
  } catch (error) {
    console.error("Error addEspecialidad:", error);
    res.status(500).json({ message: "Error al crear especialidad" });
  }
};

// Listar
export const listEspecialidades = async (req, res) => {
  try {
    const especialidades = await especialidadService.getEspecialidades();
    res.json(especialidades);
  } catch (error) {
    console.error("Error listEspecialidades:", error);
    res.status(500).json({ message: "Error al obtener especialidades" });
  }
};
