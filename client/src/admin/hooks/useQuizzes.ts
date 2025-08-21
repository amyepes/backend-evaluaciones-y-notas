import { useState, useEffect } from "react";
import { quizService, type QuizzesResponse } from "../services/quiz-service";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

interface UseQuizzesParams {
  page?: string;
  limit?: string;
  search?: string;
  subjectId?: string;
}

export const useQuizzes = (params: UseQuizzesParams = {}) => {
  const [quizzes, setQuizzes] = useState<QuizzesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizService.getAllQuizzes(params);
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

  const createQuiz = async (quizData: { name: string; subjectId: number }) => {
    try {
      await quizService.createQuiz(quizData);
      toast.success("Evaluación creada exitosamente");
      fetchQuizzes();
      return true;
    } catch (err: unknown) {
      let errorMessage = "Error al crear evaluación";
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

  const updateQuiz = async (id: number, quizData: { name?: string; subjectId?: number }) => {
    try {
      await quizService.updateQuiz(id, quizData);
      toast.success("Evaluación actualizada exitosamente");
      fetchQuizzes();
      return true;
    } catch (err: unknown) {
      let errorMessage = "Error al actualizar evaluación";
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

  const deleteQuiz = async (id: number) => {
    try {
      await quizService.deleteQuiz(id);
      toast.success("Evaluación eliminada exitosamente");
      fetchQuizzes();
      return true;
      } catch (err: unknown) {
      let errorMessage = "Error al eliminar evaluación";
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
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.search, params.subjectId]);

  return {
    quizzes,
    loading,
    error,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    refetch: fetchQuizzes,
  };
};
