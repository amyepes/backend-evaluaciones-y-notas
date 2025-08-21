import NavComponent from "../components/NavComponent";
import { useAppContext } from "@/context/useAppContext";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Settings, GraduationCap, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router";

export default function HomePage() {
  const { user } = useAppContext();

  return (
    <div>
      <NavComponent />
      
      {/* Admin Panel for ADMIN users */}
      {user?.role === "ADMIN" && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Panel de Administración</h2>
              <p className="text-blue-100">
                Bienvenido, {user.name}. Gestiona el sistema educativo desde aquí.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Link to="/admin">
                <Button className="w-full h-20 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex flex-col items-center justify-center space-y-2 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Settings className="h-8 w-8" />
                  <span className="font-semibold">Dashboard Admin</span>
                </Button>
              </Link>
              
              <Link to="/admin/users">
                <Button className="w-full h-20 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex flex-col items-center justify-center space-y-2 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Users className="h-8 w-8" />
                  <span className="font-semibold">Gestionar Usuarios</span>
                </Button>
              </Link>
              
              <Link to="/admin/subjects">
                <Button className="w-full h-20 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex flex-col items-center justify-center space-y-2 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <BookOpen className="h-8 w-8" />
                  <span className="font-semibold">Gestionar Materias</span>
                </Button>
              </Link>

              <Link to="/admin/quizzes">
                <Button className="w-full h-20 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex flex-col items-center justify-center space-y-2 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <FileText className="h-8 w-8" />
                  <span className="font-semibold">Gestionar Evaluaciones</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Student Panel for STUDENT users */}
      {user?.role === "STUDENT" && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Portal del Estudiante</h2>
              <p className="text-green-100">
                Bienvenido, {user.name}. Accede a tus materias y calificaciones.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link to="/student">
                <Button className="w-full h-20 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex flex-col items-center justify-center space-y-2 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <GraduationCap className="h-8 w-8" />
                  <span className="font-semibold">Mis Materias</span>
                </Button>
              </Link>
              
              <Link to="/student">
                <Button className="w-full h-20 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex flex-col items-center justify-center space-y-2 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <FileText className="h-8 w-8" />
                  <span className="font-semibold">Mis Evaluaciones</span>
                </Button>
              </Link>
              
              <Link to="/student">
                <Button className="w-full h-20 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex flex-col items-center justify-center space-y-2 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <TrendingUp className="h-8 w-8" />
                  <span className="font-semibold">Mis Calificaciones</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Welcome message for users without specific roles */}
      {(!user?.role || (user?.role !== "ADMIN" && user?.role !== "STUDENT")) && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenido al Sistema de Evaluaciones
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tu rol será asignado por un administrador. Una vez asignado, podrás acceder a las funcionalidades correspondientes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
