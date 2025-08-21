import { useAppContext } from "@/context/useAppContext";
import NavComponent from "@/components/NavComponent";
import { useStudentSubjects } from "../hooks/useStudent";
import SubjectCard from "../components/SubjectCard";
import StudentStats from "../components/StudentStats";
import { BookOpen, GraduationCap } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAppContext();
  const { subjects, loading } = useStudentSubjects();

  if (user?.role !== "STUDENT") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavComponent />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <GraduationCap className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Panel de Estudiante</h1>
                <p className="text-green-100 mt-2">
                  Bienvenido, {user?.name}. Aquí puedes ver tus materias y calificaciones.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <StudentStats />

        {/* Subjects Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Mis Materias</h2>
            {subjects && (
              <span className="ml-4 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {subjects.totalSubjects} materias
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : subjects && subjects.subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.subjects.map((subjectData) => (
                <SubjectCard
                  key={subjectData.subject.id}
                  subject={subjectData.subject}
                  enrolledAt={subjectData.enrolledAt}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes materias asignadas
              </h3>
              <p className="text-gray-600">
                Contacta a tu administrador para que te asigne a las materias correspondientes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
