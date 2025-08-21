import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useSubjectQuizzes } from "../hooks/useStudent";
import QuizCard from "../components/QuizCard";
import NavComponent from "@/components/NavComponent";

export default function SubjectQuizzesPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subjectIdNum, setSubjectIdNum] = useState<number | null>(null);
  
  useEffect(() => {
    if (subjectId) {
      setSubjectIdNum(parseInt(subjectId));
    }
  }, [subjectId]);

  const { quizzes, loading } = useSubjectQuizzes(subjectIdNum);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavComponent />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/student">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Materias
            </Button>
          </Link>

          {quizzes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{quizzes.subject.name}</h1>
                  <p className="text-gray-600">
                    Profesor: {quizzes.subject.professor.name} (@{quizzes.subject.professor.username})
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{quizzes.stats.totalQuizzes}</p>
                  <p className="text-sm text-gray-600">Total Evaluaciones</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{quizzes.stats.gradedQuizzes}</p>
                  <p className="text-sm text-gray-600">Calificadas</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{quizzes.stats.pendingQuizzes}</p>
                  <p className="text-sm text-gray-600">Pendientes</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className={`text-2xl font-bold ${quizzes.stats.averageGrade ? getGradeColor(quizzes.stats.averageGrade) : 'text-gray-400'}`}>
                    {quizzes.stats.averageGrade ? quizzes.stats.averageGrade.toFixed(1) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Promedio</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quizzes List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Evaluaciones</h2>
          
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
          ) : quizzes && quizzes.quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay evaluaciones disponibles
              </h3>
              <p className="text-gray-600">
                El profesor aún no ha creado evaluaciones para esta materia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
