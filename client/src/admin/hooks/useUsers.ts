import { useState, useEffect } from "react";
import { userService, User, UserQueryParams, UsersResponse, UserStats } from "../services/user-service";
import toast from "react-hot-toast";

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
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al cargar usuarios";
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
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al cargar estadísticas";
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

  const createUser = async (userData: any) => {
    setLoading(true);
    try {
      const newUser = await userService.createUser(userData);
      toast.success("Usuario creado exitosamente");
      return newUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al crear usuario";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: any) => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateUser(id, userData);
      toast.success("Usuario actualizado exitosamente");
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al actualizar usuario";
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
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al eliminar usuario";
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
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al cambiar contraseña";
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
