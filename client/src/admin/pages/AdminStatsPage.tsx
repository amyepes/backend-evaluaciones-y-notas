import { useAppContext } from "@/context/useAppContext";
import NavComponent from "@/components/NavComponent";
import { useAdminStats } from "../hooks/useAdminStats";
import { 
  Users, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
  Award,
  CheckCircle,
  BarChart3,
  Activity
} from "lucide-react";

export default function AdminStatsPage() {
  const { user } = useAppContext();
  const { systemStats, monthlyStats, loading } = useAdminStats();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavComponent />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-400" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavComponent />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <BarChart3 className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Estadísticas del Sistema</h1>
                <p className="text-purple-100 mt-2">
                  Resumen completo del rendimiento y actividad del sistema educativo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {systemStats && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.overview.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Materias</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.overview.totalSubjects}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Evaluaciones</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.overview.totalQuizzes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Calificaciones</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.overview.totalCalifications}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Users by Role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Administradores</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.userStats.byRole.admin}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Profesores</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.userStats.byRole.professor}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.userStats.byRole.student}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Promedio por Materia</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.academicStats.avgStudentsPerSubject}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-cyan-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Evaluaciones por Materia</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.academicStats.avgQuizzesPerSubject}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tasa de Aprobación</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.academicStats.passRate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Promedio General</p>
                    <p className={`text-2xl font-bold ${getGradeColor(systemStats.academicStats.averageGrade)}`}>
                      {systemStats.academicStats.averageGrade.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Growth */}
            {monthlyStats && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Crecimiento Mensual</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      {getGrowthIcon(monthlyStats.growth.users)}
                    </div>
                    <p className="text-lg font-bold text-gray-900">{monthlyStats.currentMonth.users}</p>
                    <p className="text-sm text-gray-600">Usuarios este mes</p>
                    <p className={`text-sm font-medium ${getGrowthColor(monthlyStats.growth.users)}`}>
                      {monthlyStats.growth.users > 0 ? '+' : ''}{monthlyStats.growth.users}%
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                      {getGrowthIcon(monthlyStats.growth.subjects)}
                    </div>
                    <p className="text-lg font-bold text-gray-900">{monthlyStats.currentMonth.subjects}</p>
                    <p className="text-sm text-gray-600">Materias este mes</p>
                    <p className={`text-sm font-medium ${getGrowthColor(monthlyStats.growth.subjects)}`}>
                      {monthlyStats.growth.subjects > 0 ? '+' : ''}{monthlyStats.growth.subjects}%
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5 text-purple-600 mr-2" />
                      {getGrowthIcon(monthlyStats.growth.quizzes)}
                    </div>
                    <p className="text-lg font-bold text-gray-900">{monthlyStats.currentMonth.quizzes}</p>
                    <p className="text-sm text-gray-600">Evaluaciones este mes</p>
                    <p className={`text-sm font-medium ${getGrowthColor(monthlyStats.growth.quizzes)}`}>
                      {monthlyStats.growth.quizzes > 0 ? '+' : ''}{monthlyStats.growth.quizzes}%
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <GraduationCap className="h-5 w-5 text-orange-600 mr-2" />
                      {getGrowthIcon(monthlyStats.growth.enrollments)}
                    </div>
                    <p className="text-lg font-bold text-gray-900">{monthlyStats.currentMonth.enrollments}</p>
                    <p className="text-sm text-gray-600">Inscripciones este mes</p>
                    <p className={`text-sm font-medium ${getGrowthColor(monthlyStats.growth.enrollments)}`}>
                      {monthlyStats.growth.enrollments > 0 ? '+' : ''}{monthlyStats.growth.enrollments}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente (Últimos 7 días)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.recentActivity.newUsers}</p>
                  <p className="text-sm text-gray-600">Usuarios nuevos</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.recentActivity.newSubjects}</p>
                  <p className="text-sm text-gray-600">Materias creadas</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.recentActivity.newQuizzes}</p>
                  <p className="text-sm text-gray-600">Evaluaciones creadas</p>
                </div>
              </div>
            </div>

            {/* Top Subjects */}
            {systemStats.topSubjects.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Materias más Populares</h2>
                <div className="space-y-4">
                  {systemStats.topSubjects.map((subject, index) => (
                    <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                          <p className="text-gray-600">Profesor: {subject.professor.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{subject.studentsCount} estudiantes</p>
                        <p className="text-sm text-gray-600">{subject.quizzesCount} evaluaciones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
