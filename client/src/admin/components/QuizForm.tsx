import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { useSubjects } from "../hooks/useSubjects"; 

interface QuizFormProps {
  quiz?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function QuizForm({ quiz, onSubmit, onCancel }: QuizFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    subjectId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { subjects } = useSubjects({ limit: "100" });

  useEffect(() => {
    if (quiz) {
      setFormData({
        name: quiz.name || "",
        subjectId: quiz.subjectId?.toString() || "",
      });
    }
  }, [quiz]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.subjectId) {
      newErrors.subjectId = "La materia es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        subjectId: parseInt(formData.subjectId),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">
            {quiz ? "Editar Evaluación" : "Nueva Evaluación"}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Evaluación *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Examen Parcial 1"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
            Materia *
          </label>
          <select
            id="subjectId"
            name="subjectId"
            value={formData.subjectId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.subjectId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Selecciona una materia</option>
            {subjects?.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} - {subject.professor.name}
              </option>
            ))}
          </select>
          {errors.subjectId && (
            <p className="text-red-600 text-sm mt-1">{errors.subjectId}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
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
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? "Guardando..." : quiz ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </div>
  );
}
