import { useState, useEffect } from "react";
import { adminStatsService, type SystemStats, type MonthlyStats } from "../services/admin-stats-service";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useAdminStats = () => {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [systemResponse, monthlyResponse] = await Promise.all([
        adminStatsService.getSystemStats(),
        adminStatsService.getMonthlyStats(),
      ]);
      
      setSystemStats(systemResponse);
      setMonthlyStats(monthlyResponse);
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
    fetchStats();
  }, []);

  return {
    systemStats,
    monthlyStats,
    loading,
    error,
    refetch: fetchStats,
  };
};
