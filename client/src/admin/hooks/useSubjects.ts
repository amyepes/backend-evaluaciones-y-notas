import { useState, useEffect } from "react";
import { subjectService, type Subject, type SubjectQueryParams, type SubjectsResponse, type SubjectStats } from "../services/subject-service";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
  
export const useSubjects = (params: SubjectQueryParams = {}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async (queryParams: SubjectQueryParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response: SubjectsResponse = await subjectService.getAllSubjects(queryParams);
      setSubjects(response.subjects);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
          (axiosError.response?.data &&
            typeof axiosError.response.data === "object" &&
            "message" in axiosError.response.data
                  ? (axiosError.response.data as { message?: string }).message
                  : undefined) ||
          "Error al cargar materias";
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
    pagination,
    loading,
    error,
    refetch: fetchSubjects,
  };
};

export const useSubjectStats = () => {
  const [stats, setStats] = useState<SubjectStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await subjectService.getSubjectStats();
      setStats(response);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) ||
        "Error al cargar estadísticas";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

export const useSubjectActions = () => {
  const [loading, setLoading] = useState(false);

    const createSubject = async (subjectData: { name: string; professorId: number }) => {
    setLoading(true);
    try {
      const newSubject = await subjectService.createSubject(subjectData);
      toast.success("Materia creada exitosamente");
      return newSubject;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) ||
        "Error al crear materia";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id: number, subjectData: { name?: string; professorId?: number }) => {
    setLoading(true);
    try {
      const updatedSubject = await subjectService.updateSubject(id, subjectData);
      toast.success("Materia actualizada exitosamente");
      return updatedSubject;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) ||
        "Error al actualizar materia";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: number) => {
    setLoading(true);
    try {
      await subjectService.deleteSubject(id);
      toast.success("Materia eliminada exitosamente");
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) ||
        "Error al eliminar materia";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignStudent = async (subjectId: number, studentId: number) => {
    setLoading(true);
    try {
      await subjectService.assignStudentToSubject(subjectId, studentId);
      toast.success("Estudiante asignado exitosamente");
      return true;
      } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) ||
        "Error al asignar estudiante";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (subjectId: number, studentId: number) => {
    setLoading(true);
    try {
      await subjectService.removeStudentFromSubject(subjectId, studentId);
      toast.success("Estudiante removido exitosamente");
      return true;
      } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) ||
        "Error al remover estudiante";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSubject,
    updateSubject,
    deleteSubject,
    assignStudent,
    removeStudent,
    loading,
  };
};
