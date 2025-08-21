import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  BookOpen, 
  Calendar,
  Edit,
  Trash2,
  UserPlus,
  UserMinus
} from "lucide-react";
import { useSubjectDetails, useSubjectActions } from "../hooks/useSubjectDetails";
import { useQuizzes } from "../hooks/useQuizzes";
import { useUsers } from "../hooks/useUsers";
import QuizForm from "../components/QuizForm";
import CalificationForm from "../components/CalificationForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SubjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const subjectId = id ? parseInt(id) : null;
  
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const { subject, loading, refetch } = useSubjectDetails(subjectId);
  const { assignStudent, removeStudent, loading: actionLoading } = useSubjectActions();
  const { createQuiz, deleteQuiz } = useQuizzes({ subjectId: subjectId?.toString() });
  const { users: allUsers } = useUsers({ role: "STUDENT", limit: 100 });

  if (!subjectId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Materia no encontrada</h1>
          <Link to="/admin/subjects">
            <Button>Volver a Materias</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Materia no encontrada</h1>
          <Link to="/admin/subjects">
            <Button>Volver a Materias</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateQuiz = async (quizData: { name: string; subjectId: number }) => {
    const success = await createQuiz(quizData);
    if (success) {
      setShowQuizForm(false);
      refetch();
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta evaluación?")) {
      const success = await deleteQuiz(quizId);
      if (success) {
        refetch();
      }
    }
  };

  const handleAssignStudent = async () => {
    if (!selectedStudentId) return;
    
    const success = await assignStudent(subjectId, parseInt(selectedStudentId));
    if (success) {
      setShowStudentDialog(false);
      setSelectedStudentId("");
      refetch();
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (window.confirm("¿Estás seguro de que quieres remover este estudiante de la materia?")) {
      const success = await removeStudent(subjectId, studentId);
      if (success) {
        refetch();
      }
    }
  };

  const handleGradeStudent = (quizId: number) => {
    setSelectedQuizId(quizId);
    setShowGradeForm(true);
  };

  const availableStudents = allUsers?.filter(user => 
    user.role === "STUDENT" && !subject.studentSubject?.some(ss => ss.student.id === user.id)
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin/subjects">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Materias
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
              <p className="text-gray-600 mt-2">
                Profesor: {subject.professor?.name} (@{subject.professor?.username})
              </p>
              <p className="text-gray-500 text-sm">
                Creada el {new Date(subject.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            <Button 
              onClick={() => navigate(`/admin/subjects/edit/${subjectId}`)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Materia
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subject.studentSubject?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Evaluaciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subject.quizzes?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Días Activa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.ceil((Date.now() - new Date(subject.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quizzes Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Evaluaciones</h3>
                <Button 
                  onClick={() => setShowQuizForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Evaluación
                </Button>
              </div>
            </div>
            <div className="p-6">
              {subject.quizzes && subject.quizzes.length > 0 ? (
                <div className="space-y-4">
                  {subject.quizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{quiz.name}</h4>
                        <p className="text-sm text-gray-500">
                          Creada el {new Date(quiz.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGradeStudent(quiz.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Calificar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay evaluaciones creadas</p>
                  <Button 
                    onClick={() => setShowQuizForm(true)}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Crear Primera Evaluación
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Students Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Estudiantes</h3>
                <Button 
                  onClick={() => setShowStudentDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                  disabled={availableStudents.length === 0}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Añadir Estudiante
                </Button>
              </div>
            </div>
            <div className="p-6">
              {subject.studentSubject && subject.studentSubject.length > 0 ? (
                <div className="space-y-4">
                  {subject.studentSubject.map((ss) => (
                    <div key={ss.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{ss.student.name}</h4>
                        <p className="text-sm text-gray-500">@{ss.student.username}</p>
                        <p className="text-xs text-gray-400">
                          Asignado el {new Date(ss.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveStudent(ss.student.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay estudiantes asignados</p>
                  <Button 
                    onClick={() => setShowStudentDialog(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    disabled={availableStudents.length === 0}
                  >
                    Asignar Primer Estudiante
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Form Modal */}
        {showQuizForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Nueva Evaluación</h3>
              </div>
              <QuizForm
                quiz={null}
                onSubmit={handleCreateQuiz}
                onCancel={() => setShowQuizForm(false)}
                defaultSubjectId={subjectId}
              />
            </div>
          </div>
        )}

        {/* Student Assignment Dialog */}
        <AlertDialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Asignar Estudiante</AlertDialogTitle>
              <AlertDialogDescription>
                Selecciona un estudiante para asignar a esta materia.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar estudiante...</option>
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (@{student.username})
                  </option>
                ))}
              </select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleAssignStudent}
                disabled={!selectedStudentId || actionLoading}
              >
                {actionLoading ? "Asignando..." : "Asignar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Grade Form Modal */}
        {showGradeForm && selectedQuizId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Calificar Estudiantes</h3>
              </div>
              <CalificationForm
                quizId={selectedQuizId}
                students={subject.studentSubject?.map(ss => ss.student) || []}
                onSubmit={() => {
                  setShowGradeForm(false);
                  setSelectedQuizId(null);
                }}
                onCancel={() => {
                  setShowGradeForm(false);
                  setSelectedQuizId(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
