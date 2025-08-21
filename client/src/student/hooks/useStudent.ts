    import { useState, useEffect } from "react";
    import { 
      studentService, 
      type StudentSubjectsResponse, 
      type SubjectQuizzesResponse, 
      type StudentGradesResponse 
    } from "../services/student-service";
    import toast from "react-hot-toast";
    import type { AxiosError } from "axios";

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
        } catch (err: unknown) {
          let errorMessage = "Error al cargar materias";
          if (err && typeof err === "object") {
            const axiosError = err as AxiosError;
            errorMessage =
              (axiosError.response?.data &&
                typeof axiosError.response.data === "object" &&
                "message" in axiosError.response.data
                  ? (axiosError.response.data as { message?: string }).message
                  : undefined) ||
              errorMessage;
          }
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
        } catch (err: unknown) {
          let errorMessage = "Error al cargar evaluaciones";
          if (err && typeof err === "object") {
            const axiosError = err as AxiosError;
            errorMessage =
              (axiosError.response?.data &&
                typeof axiosError.response.data === "object" &&
                "message" in axiosError.response.data
                  ? (axiosError.response.data as { message?: string }).message
                  : undefined) ||
              errorMessage;
          }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        } catch (err: unknown) {
          let errorMessage = "Error al cargar calificaciones";
          if (err && typeof err === "object") {
            const axiosError = err as AxiosError;
            errorMessage =
              (axiosError.response?.data &&
                typeof axiosError.response.data === "object" &&
                "message" in axiosError.response.data
                  ? (axiosError.response.data as { message?: string }).message
                  : undefined) ||
              errorMessage;
          }
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        } catch (err: unknown) {
          let errorMessage = "Error al cargar estadísticas";
          if (err && typeof err === "object") {
            const axiosError = err as AxiosError;
            errorMessage =
              (axiosError.response?.data &&
                typeof axiosError.response.data === "object" &&
                "message" in axiosError.response.data
                    ? (axiosError.response.data as { message?: string }).message
                  : undefined) ||
              errorMessage;
          }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [subjectId]);

      return {
        stats,
        loading,
        error,
        refetch: fetchStats,
      };
    };
