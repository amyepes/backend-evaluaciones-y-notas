import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Award } from "lucide-react";
import { useQuizzes } from "../hooks/useQuizzes";
 

interface CalificationFormProps {
  calification?: {
    id?: number;
    studentId?: number;
    quizId?: number;
    grade?: number;
  };
  quizId?: number;
  students?: Array<{
    id: number;
    name: string;
    username: string;
  }>;
  onSubmit: (data?: {
    studentId: number;
    quizId: number;
    grade: number;
  }) => void;
  onCancel: () => void;
}

export default function CalificationForm({ calification, quizId, students = [], onSubmit, onCancel }: CalificationFormProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    quizId: "",
    grade: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { quizzes } = useQuizzes({ limit: "100" });

  useEffect(() => {
    if (quizId) {
      setFormData(prev => ({
        ...prev,
        quizId: quizId.toString(),
      }));
    }
  }, [quizId]);

  useEffect(() => {
    if (calification) {
      setFormData({
        studentId: calification.studentId?.toString() || "",
        quizId: calification.quizId?.toString() || "",
        grade: calification.grade?.toString() || "",
      });
    }
  }, [calification]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) {
      newErrors.studentId = "El estudiante es requerido";
    }

    if (!formData.quizId) {
      newErrors.quizId = "La evaluación es requerida";
    }

    if (!formData.grade.trim()) {
      newErrors.grade = "La calificación es requerida";
    } else {
      const grade = parseFloat(formData.grade);
      if (isNaN(grade) || grade < 0 || grade > 100) {
        newErrors.grade = "La calificación debe estar entre 0 y 100";
      }
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
        studentId: parseInt(formData.studentId),
        quizId: parseInt(formData.quizId),
        grade: parseFloat(formData.grade),
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
          <Award className="h-6 w-6 text-orange-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">
            {calification ? "Editar Calificación" : "Nueva Calificación"}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
            Estudiante *
          </label>
          <select
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            disabled={!!calification} // Don't allow changing student for existing califications
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.studentId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seleccionar estudiante</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} (@{student.username})
              </option>
            ))}
          </select>
          {errors.studentId && (
            <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
          )}
        </div>

        <div>
          <label htmlFor="quizId" className="block text-sm font-medium text-gray-700 mb-2">
            Evaluación *
          </label>
          <select
            id="quizId"
            name="quizId"
            value={formData.quizId}
            onChange={handleInputChange}
            disabled={!!calification} // Don't allow changing quiz for existing califications
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.quizId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seleccionar evaluación</option>
            {quizzes?.quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.name} - {quiz.subject.name}
              </option>
            ))}
          </select>
          {errors.quizId && (
            <p className="mt-1 text-sm text-red-600">{errors.quizId}</p>
          )}
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
            Calificación (0-100) *
          </label>
          <input
            type="number"
            id="grade"
            name="grade"
            min="0"
            max="100"
            step="0.1"
            value={formData.grade}
            onChange={handleInputChange}
            placeholder="Ingrese la calificación"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.grade ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.grade && (
            <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
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
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? "Guardando..." : calification ? "Actualizar" : "Crear"} Calificación
          </Button>
        </div>
      </form>
    </div>
  );
}
