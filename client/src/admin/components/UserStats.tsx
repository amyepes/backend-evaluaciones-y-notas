import { Users, UserCheck, GraduationCap, Shield } from "lucide-react";
import { useUserStats } from "../hooks/useUsers";

export default function UserStats() {
  const { stats, loading } = useUserStats();

  if (loading) { 
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-red-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Administradores</p>
            <p className="text-2xl font-bold text-gray-900">{stats.byRole.admin}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <UserCheck className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Profesores</p>
            <p className="text-2xl font-bold text-gray-900">{stats.byRole.professor}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Estudiantes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.byRole.student}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
