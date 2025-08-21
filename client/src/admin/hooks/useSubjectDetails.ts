import { useState, useEffect } from "react";
import { subjectService, type Subject } from "../services/subject-service";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useSubjectDetails = (subjectId: number | null) => {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjectDetails = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subjectService.getSubjectById(id);
      setSubject(response);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) ||
        "Error al cargar detalles de la materia";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchSubjectDetails(subjectId);
    }
  }, [subjectId]);

  return {
    subject,
    loading,
    error,
    refetch: () => subjectId && fetchSubjectDetails(subjectId),
  };
};

export const useSubjectActions = () => {
  const [loading, setLoading] = useState(false);

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
      return false;
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
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignStudent,
    removeStudent,
    loading,
  };
};
