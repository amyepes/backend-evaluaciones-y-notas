import { useAppContext } from "@/context/useAppContext";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart3, FileText, Award } from "lucide-react";
import { Link } from "react-router";
import NavComponent from "@/components/NavComponent";

export default function AdminDashboard() {
  const { user } = useAppContext();

  if (user?.role !== "ADMIN") {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.name}. Gestiona usuarios y materias del sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Card de Usuarios */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">Usuarios</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Gestiona usuarios del sistema: estudiantes, profesores y administradores.
              </p>
              <Link to="/admin/users">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Usuarios
                </Button>
              </Link>
            </div>
          </div>

          {/* Card de Materias */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">Materias</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Administra las materias del sistema y asigna estudiantes a profesores.
              </p>
              <Link to="/admin/subjects">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Gestionar Materias
                </Button>
              </Link>
            </div>
          </div>

          {/* Card de Evaluaciones */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">Evaluaciones</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Gestiona las evaluaciones y calificaciones del sistema.
              </p>
              <Link to="/admin/quizzes">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Gestionar Evaluaciones
                </Button>
              </Link>
            </div>
          </div>

          {/* Card de Calificaciones */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-red-600" />
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">Calificaciones</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Gestiona las calificaciones de los estudiantes.
              </p>
              <Link to="/admin/grading">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Award className="h-4 w-4 mr-2" />
                  Gestionar Calificaciones
                </Button>
              </Link>
            </div>
          </div>

          {/* Card de Estadísticas */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">Estadísticas</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Visualiza estadísticas y reportes del sistema educativo.
              </p>
              <Link to="/admin/stats">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Estadísticas
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">👥</div>
              <p className="text-sm text-gray-600 mt-2">Gestión completa de usuarios con roles diferenciados</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">📚</div>
              <p className="text-sm text-gray-600 mt-2">Administración de materias y asignación de estudiantes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">📝</div>
              <p className="text-sm text-gray-600 mt-2">Sistema completo de evaluaciones y calificaciones</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">🏆</div>
              <p className="text-sm text-gray-600 mt-2">Gestión completa de calificaciones</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">📊</div>
              <p className="text-sm text-gray-600 mt-2">Reportes y estadísticas en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
