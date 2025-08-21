import { useState, useEffect } from "react";
import { userService, type User, type UserQueryParams, type UsersResponse, type UserStats } from "../services/user-service";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useUsers = (params: UserQueryParams = {}) => {
  const [users, setUsers] = useState<User[]>([]);
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

  const fetchUsers = async (queryParams: UserQueryParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response: UsersResponse = await userService.getAllUsers(queryParams);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) ||
        "Error al cargar usuarios";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    pagination,
    loading,
    error,
    refetch: fetchUsers,
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUserStats();
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

export const useUserActions = () => {
  const [loading, setLoading] = useState(false);

  const createUser = async (userData: { name: string; username: string; role: string; password: string }) => {
    setLoading(true);
    try {
      const newUser = await userService.createUser(userData);
      toast.success("Usuario creado exitosamente");
      return newUser;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) || "Error al crear usuario";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: { name?: string; role?: string; password?: string }) => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateUser(id, userData);
      toast.success("Usuario actualizado exitosamente");
      return updatedUser;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) || "Error al actualizar usuario";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setLoading(true);
    try {
      await userService.deleteUser(id);
      toast.success("Usuario eliminado exitosamente");
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) || "Error al eliminar usuario";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (id: number, password: string) => {
    setLoading(true);
    try {
      await userService.changeUserPassword(id, password);
      toast.success("Contraseña actualizada exitosamente");
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) || "Error al cambiar contraseña";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    loading,
  };
};
