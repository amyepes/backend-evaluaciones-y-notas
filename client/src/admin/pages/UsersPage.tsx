import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search, Filter } from "lucide-react";
import { Link } from "react-router";
import { useUsers, useUserActions } from "../hooks/useUsers";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import UserStats from "../components/UserStats";

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id: number; name: string; username: string; role: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
 
  const { users, pagination, loading, refetch } = useUsers({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    role: roleFilter || undefined,
  });

  const { createUser, updateUser, deleteUser, loading: actionLoading } = useUserActions();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch({
      page: 1,
      limit: 10,
      search: searchTerm || undefined,
      role: roleFilter || undefined,
    });
  };

  const handleCreateUser = async (userData: { name: string; username: string; role: string; password: string }) => {
    try {
      await createUser(userData);
      setShowForm(false);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  const handleUpdateUser = async (userData: { name?: string; role?: string; password?: string }) => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, userData);
      setShowForm(false);
      setEditingUser(null);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await deleteUser(userId);
        refetch();
      } catch {
        // Error handled by hook
      }
    }
  };

  const handleEditUser = (user: { id: number; name: string; username: string; role: string }) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch({
      page,
      limit: 10,
      search: searchTerm || undefined,
      role: roleFilter || undefined,
    });
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingUser(null);
              }}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h1>
          </div>
          
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser as any}
            onCancel={() => {
              setShowForm(false);
              setEditingUser(null);
            }}
            loading={actionLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin">
                <Button variant="outline" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600 mt-2">
                Administra los usuarios del sistema educativo
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Stats */}
        <UserStats />

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Todos los roles</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="PROFESSOR">Profesor</option>
                  <option value="STUDENT">Estudiante</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Buscar
            </Button>
          </form>
        </div>

        {/* User List */}
        <UserList
          users={users}
          pagination={pagination}
          loading={loading}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
