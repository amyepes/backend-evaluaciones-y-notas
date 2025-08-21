import { Button } from "@/components/ui/button";
import { BookOpen, User, Calendar, FileText, Users } from "lucide-react";
import { Link } from "react-router";

interface SubjectCardProps {
  subject: {
    id: number;
    name: string;
    professorId: number;
    createdAt: string;
    professor: {
      id: number;
      name: string;
      username: string;
    };
    _count: {
      quizzes: number;
      studentSubject: number;
    };
  };
  enrolledAt: string;
}

export default function SubjectCard({ subject, enrolledAt }: SubjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
              <p className="text-sm text-gray-500">ID: {subject.id}</p>
            </div>
          </div>
        </div>

        {/* Professor Info */}
        <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <User className="h-5 w-5 text-gray-600 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-900">{subject.professor.name}</p>
            <p className="text-xs text-gray-600">@{subject.professor.username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-semibold text-blue-900">{subject._count.quizzes}</p>
            <p className="text-xs text-blue-700">Evaluaciones</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <Users className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-semibold text-green-900">{subject._count.studentSubject}</p>
            <p className="text-xs text-green-700">Estudiantes</p>
          </div>
        </div>

        {/* Enrollment Date */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Inscrito: {new Date(enrolledAt).toLocaleDateString('es-ES')}</span>
        </div>

        {/* Action Button */}
        <Link to={`/student/subject/${subject.id}/quizzes`}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Ver Evaluaciones
          </Button>
        </Link>
      </div>
    </div>
  );
}
