import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useSubjects, useSubjectActions } from "../hooks/useSubjects";
import type { Subject } from "../services/subject-service";
import SubjectList from "../components/SubjectList";
import SubjectForm from "../components/SubjectForm"; 
import SubjectStats from "../components/SubjectStats";

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [professorFilter, setProfessorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 

  const { subjects, pagination, loading, refetch } = useSubjects({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    professorId: professorFilter ? parseInt(professorFilter) : undefined,
  });

  const { createSubject, updateSubject, deleteSubject, loading: actionLoading } = useSubjectActions();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch({
      page: 1,
      limit: 10,
      search: searchTerm || undefined,
      professorId: professorFilter ? parseInt(professorFilter) : undefined,
    });
  };

  const handleCreateSubject = async (subjectData: { name: string; professorId: number }) => {
    try {
      await createSubject(subjectData);
      setShowForm(false);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  const handleUpdateSubject = async (subjectData: { name?: string; professorId?: number }) => {
    if (!editingSubject) return;
    try {
      await updateSubject(editingSubject.id, subjectData);
      setShowForm(false);
      setEditingSubject(null);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta materia?")) {
      try {
        await deleteSubject(subjectId);
        refetch();
      } catch {
        // Error handled by hook
      }
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch({
      page,
      limit: 10,
      search: searchTerm || undefined,
      professorId: professorFilter ? parseInt(professorFilter) : undefined,
    });
  };

  const handleViewDetails = (subjectId: number) => {
    navigate(`/admin/subjects/${subjectId}`);
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
                setEditingSubject(null);
              }}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingSubject ? "Editar Materia" : "Crear Nueva Materia"}
            </h1>
          </div>
          
          <SubjectForm
            subject={editingSubject}
            onSubmit={editingSubject ? handleUpdateSubject : handleCreateSubject}
            onCancel={() => {
              setShowForm(false);
              setEditingSubject(null);
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Materias</h1>
              <p className="text-gray-600 mt-2">
                Administra las materias del sistema educativo
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Materia
            </Button>
          </div>
        </div>

        {/* Stats */}
        <SubjectStats />

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de materia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="ID del profesor"
                  value={professorFilter}
                  onChange={(e) => setProfessorFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Buscar
            </Button>
          </form>
        </div>

        {/* Subject List */}
        <SubjectList
          subjects={subjects}
          pagination={pagination}
          loading={loading}
          onEdit={handleEditSubject}
          onDelete={handleDeleteSubject}
          onViewDetails={handleViewDetails}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
