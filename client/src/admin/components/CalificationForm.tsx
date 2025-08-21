import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Award, Save } from "lucide-react";
import { useCalifications } from "../hooks/useCalifications";
import { calificationService } from "../services/calification-service";
import toast from "react-hot-toast";

interface CalificationFormProps {
  quizId?: number;
  students?: Array<{
    id: number;
    name: string;
    username: string;
  }>;
  onSubmit: () => void;
  onCancel: () => void;
}

interface StudentGrade {
  studentId: number;
  grade: string;
  hasExistingGrade: boolean;
  existingGradeId?: number;
}

export default function CalificationForm({ quizId, students = [], onSubmit, onCancel }: CalificationFormProps) {
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const { createCalification, updateCalification } = useCalifications();

  useEffect(() => {
    const loadExistingGrades = async () => {
      if (students.length > 0 && quizId) {
        setLoadingGrades(true);
        try {
          // Fetch existing grades for this quiz
          const response = await calificationService.getCalificationsByQuiz(quizId);
          const existingGrades = response.califications || [];

          // Initialize grades for all students
          const initialGrades: StudentGrade[] = students.map(student => {
            const existingGrade = existingGrades.find((grade: { id: number; studentId: number; grade: number }) => grade.studentId === student.id);
            
            return {
              studentId: student.id,
              grade: existingGrade ? existingGrade.grade.toString() : "",
              hasExistingGrade: !!existingGrade,
              existingGradeId: existingGrade?.id,
            };
          });
          
          setStudentGrades(initialGrades);
        } catch (error) {
          console.error("Error loading existing grades:", error);
          // If error, initialize empty grades
          const initialGrades: StudentGrade[] = students.map(student => ({
            studentId: student.id,
            grade: "",
            hasExistingGrade: false,
          }));
          setStudentGrades(initialGrades);
        } finally {
          setLoadingGrades(false);
        }
      }
    };

    loadExistingGrades();
  }, [students, quizId]);

  const handleGradeChange = (studentId: number, value: string) => {
    setStudentGrades(prev => prev.map(sg => 
      sg.studentId === studentId 
        ? { ...sg, grade: value }
        : sg
    ));
    
    // Clear error when user starts typing
    if (errors[studentId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[studentId];
        return newErrors;
      });
    }
  };

  const validateGrades = () => {
    const newErrors: Record<number, string> = {};
    
    studentGrades.forEach(sg => {
      if (sg.grade.trim() !== "") {
        const grade = parseFloat(sg.grade);
        if (isNaN(grade) || grade < 0 || grade > 100) {
          newErrors[sg.studentId] = "Nota debe estar entre 0 y 100";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateGrades() || !quizId) return;

    // Filter only students with grades entered
    const gradesToSave = studentGrades.filter(sg => sg.grade.trim() !== "");
    
    if (gradesToSave.length === 0) {
      toast.error("Ingresa al menos una nota");
      return;
    }

    setLoading(true);
    try {
      // Save each grade
      const promises = gradesToSave.map(sg => {
        const gradeData = {
          studentId: sg.studentId,
          quizId: quizId,
          grade: parseFloat(sg.grade),
        };

        if (sg.hasExistingGrade && sg.existingGradeId) {
          return updateCalification(sg.existingGradeId, { grade: parseFloat(sg.grade) });
        } else {
          return createCalification(gradeData);
        }
      });

      await Promise.all(promises);
      toast.success(`${gradesToSave.length} nota(s) guardada(s) exitosamente`);
      onSubmit();
    } catch {
      toast.error("Error al guardar las notas");
    } finally {
      setLoading(false);
    }
  };

  if (!quizId) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: No se pudo cargar la evaluación</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Award className="h-6 w-6 text-orange-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">
            Calificar Estudiantes
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

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loadingGrades ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Cargando notas existentes...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay estudiantes asignados a esta materia</p>
            </div>
          ) : (
            students.map((student) => {
              const studentGrade = studentGrades.find(sg => sg.studentId === student.id);
              const error = errors[student.id];
              
              return (
                <div key={student.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">@{student.username}</p>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Nota"
                      value={studentGrade?.grade || ""}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        error ? "border-red-500" : studentGrade?.hasExistingGrade ? "border-green-300 bg-green-50" : "border-gray-300"
                      }`}
                    />
                    {error && (
                      <p className="text-red-600 text-xs mt-1">{error}</p>
                    )}
                  </div>
                  <div className="w-16 text-center">
                    {studentGrade?.hasExistingGrade ? (
                      <span className="text-xs text-green-600 font-medium">Guardada</span>
                    ) : (
                      <span className="text-sm text-gray-500">/ 100</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {students.length > 0 && (
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
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
              {loading ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Notas
                </>
              )}
            </Button>
          </div>
        )}
      </form>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Instrucciones:</strong> Ingresa las notas de 0 a 100. Puedes dejar en blanco los estudiantes que no quieras calificar en este momento.
        </p>
      </div>
    </div>
  );
}