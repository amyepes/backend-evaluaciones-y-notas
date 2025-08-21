import { useState, useEffect } from "react";
import { calificationService, type CalificationsResponse } from "../services/calification-service";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

interface UseCalificationsParams {
  page?: string;
  limit?: string;
  search?: string;
  studentId?: string;
  quizId?: string;
  subjectId?: string;
}

export const useCalifications = (params: UseCalificationsParams = {}) => {
  const [califications, setCalifications] = useState<CalificationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await calificationService.getAllCalifications(params);
      setCalifications(response);
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

  const createCalification = async (calificationData: { studentId: number; quizId: number; grade: number }) => {
    try {
      await calificationService.createCalification(calificationData);
      toast.success("Calificación creada exitosamente");
      fetchCalifications();
      return true;
    } catch (err: unknown) {
      let errorMessage = "Error al crear calificación";
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
      toast.error(errorMessage);
      return false;
    }
  };

  const updateCalification = async (id: number, calificationData: { grade?: number }) => {
    try {
      await calificationService.updateCalification(id, calificationData);
      toast.success("Calificación actualizada exitosamente");
      fetchCalifications();
      return true;
    } catch (err: unknown) {
      let errorMessage = "Error al actualizar calificación";
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
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteCalification = async (id: number) => {
    try {
      await calificationService.deleteCalification(id);
      toast.success("Calificación eliminada exitosamente");
      fetchCalifications();
      return true;
      } catch (err: unknown) {
      let errorMessage = "Error al eliminar calificación";
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
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchCalifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.search, params.studentId, params.quizId, params.subjectId]);

  return {
    califications,
    loading,
    error,
    createCalification,
    updateCalification,
    deleteCalification,
    refetch: fetchCalifications,
  };
};
