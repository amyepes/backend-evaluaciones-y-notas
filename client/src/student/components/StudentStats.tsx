import { BookOpen, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useStudentGrades } from "../hooks/useStudent";

export default function StudentStats() {
  const { grades, loading } = useStudentGrades();

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

  if (!grades) return null;

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const approvedSubjects = grades.gradesBySubject.filter(s => s.averageGrade >= 70).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Materias Inscritas</p>
            <p className="text-2xl font-bold text-gray-900">{grades.gradesBySubject.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Materias Aprobadas</p>
            <p className="text-2xl font-bold text-gray-900">{approvedSubjects}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Evaluaciones</p>
            <p className="text-2xl font-bold text-gray-900">{grades.totalGrades}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-orange-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Promedio General</p>
            <p className={`text-2xl font-bold ${grades.overallAverage > 0 ? getGradeColor(grades.overallAverage) : 'text-gray-400'}`}>
              {grades.overallAverage > 0 ? grades.overallAverage.toFixed(1) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
