import { useState, useEffect } from "react";
import { 
  studentService, 
  StudentSubjectsResponse, 
  SubjectQuizzesResponse, 
  StudentGradesResponse 
} from "../services/student-service";
import toast from "react-hot-toast";

export const useStudentSubjects = () => {
  const [subjects, setSubjects] = useState<StudentSubjectsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.getMySubjects();
      setSubjects(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al cargar materias";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects,
    loading,
    error,
    refetch: fetchSubjects,
  };
};

export const useSubjectQuizzes = (subjectId: number | null) => {
  const [quizzes, setQuizzes] = useState<SubjectQuizzesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    if (!subjectId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.getSubjectQuizzes(subjectId);
      setQuizzes(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al cargar evaluaciones";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchQuizzes();
    }
  }, [subjectId]);

  return {
    quizzes,
    loading,
    error,
    refetch: fetchQuizzes,
  };
};

export const useStudentGrades = () => {
  const [grades, setGrades] = useState<StudentGradesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.getMyGrades();
      setGrades(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al cargar calificaciones";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  return {
    grades,
    loading,
    error,
    refetch: fetchGrades,
  };
};

export const useSubjectStats = (subjectId: number | null) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!subjectId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.getSubjectStats(subjectId);
      setStats(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al cargar estadísticas";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchStats();
    }
  }, [subjectId]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
