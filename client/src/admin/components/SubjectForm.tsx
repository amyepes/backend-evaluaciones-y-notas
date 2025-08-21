import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Subject } from "../services/subject-service";
import { userService } from "../services/user-service";

interface SubjectFormProps {
  subject?: Subject | null;
  onSubmit: (subjectData: { name: string; professorId: number }) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function SubjectForm({ subject, onSubmit, onCancel, loading }: SubjectFormProps) {
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    professorId: subject?.professorId || "",
  });

  const [professors, setProfessors] = useState<{ id: number; name: string; username: string }[]>([]);
  const [loadingProfessors, setLoadingProfessors] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); 

  useEffect(() => {
    const fetchProfessors = async () => {
      setLoadingProfessors(true);
      try {
        const professorsData = await userService.getUsersByRole("PROFESSOR");
        setProfessors(professorsData);
      } catch (error) {
        console.error("Error fetching professors:", error);
      } finally {
        setLoadingProfessors(false);
      }
    };

    fetchProfessors();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la materia es requerido";
    } else if (formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.professorId) {
      newErrors.professorId = "Debe seleccionar un profesor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name,
        professorId: parseInt(formData.professorId as string),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Materia
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ingresa el nombre de la materia"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="professorId" className="block text-sm font-medium text-gray-700 mb-1">
            Profesor Asignado
          </label>
          <select
            id="professorId"
            name="professorId"
            value={formData.professorId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.professorId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loadingProfessors}
          >
            <option value="">
              {loadingProfessors ? "Cargando profesores..." : "Selecciona un profesor"}
            </option>
            {professors.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {professor.name} (@{professor.username})
              </option>
            ))}
          </select>
          {errors.professorId && <p className="mt-1 text-sm text-red-600">{errors.professorId}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || loadingProfessors}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Guardando..." : subject ? "Actualizar Materia" : "Crear Materia"}
          </Button>
        </div>
      </form>
    </div>
  );
}
