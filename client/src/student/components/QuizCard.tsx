import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { SubjectQuiz } from "../services/student-service";

interface QuizCardProps {
  quiz: SubjectQuiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (grade >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (grade >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusIcon = () => {
    if (quiz.hasGrade) {
      if (quiz.grade! >= 70) {
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      } else {
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      }
    }
    return <Clock className="h-5 w-5 text-yellow-600" />;
  };

  const getStatusText = () => {
    if (quiz.hasGrade) {
      return quiz.grade! >= 70 ? "Aprobado" : "No Aprobado";
    }
    return "Pendiente";
  };

  const getStatusColor = () => {
    if (quiz.hasGrade) {
      return quiz.grade! >= 70 ? "text-green-600" : "text-red-600";
    }
    return "text-yellow-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Creado: {new Date(quiz.createdAt).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
          <div className="flex items-center">
            {getStatusIcon()}
          </div>
        </div>

        {/* Grade Section */}
        <div className="mb-4">
          {quiz.hasGrade ? (
            <div className={`p-4 rounded-lg border-2 ${getGradeColor(quiz.grade!)}`}>
              <div className="text-center">
                <p className="text-3xl font-bold mb-1">{quiz.grade}</p>
                <p className="text-sm font-medium">/ 100</p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
              <div className="text-center">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Sin Calificar</p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          {quiz.hasGrade && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Calificación registrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
