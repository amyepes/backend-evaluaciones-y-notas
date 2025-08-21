import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search, Filter } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useSubjects, useSubjectActions } from "../hooks/useSubjects";
import { subjectService } from "../services/subject-service";
import type { Subject } from "../services/subject-service";
import SubjectList from "../components/SubjectList";
import SubjectForm from "../components/SubjectForm"; 
import SubjectStats from "../components/SubjectStats";
import toast from "react-hot-toast";

export default function SubjectsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [showForm, setShowForm] = useState(isEditMode);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [loadingSubject, setLoadingSubject] = useState(isEditMode);
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

  // Load subject for editing when in edit mode
  useEffect(() => {
    const loadSubjectForEdit = async () => {
      if (isEditMode && id) {
        setLoadingSubject(true);
        try {
          const subject = await subjectService.getSubjectById(parseInt(id));
          setEditingSubject(subject);
        } catch {
          toast.error("Error al cargar la materia");
          navigate("/admin/subjects");
        } finally {
          setLoadingSubject(false);
        }
      }
    };

    loadSubjectForEdit();
  }, [isEditMode, id, navigate]);

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
      if (isEditMode) {
        // If in edit mode, redirect back to subject details
        navigate(`/admin/subjects/${editingSubject.id}`);
      } else {
        // If in regular mode, just close form and refresh
        setShowForm(false);
        setEditingSubject(null);
        refetch();
      }
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
    if (loadingSubject) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                if (isEditMode) {
                  navigate(`/admin/subjects/${id}`);
                } else {
                  setShowForm(false);
                  setEditingSubject(null);
                }
              }}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isEditMode ? "Volver a detalles" : "Volver a la lista"}
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingSubject ? "Editar Materia" : "Crear Nueva Materia"}
            </h1>
          </div>
          
          <SubjectForm
            subject={editingSubject}
            onSubmit={editingSubject ? handleUpdateSubject : handleCreateSubject}
            onCancel={() => {
              if (isEditMode) {
                navigate(`/admin/subjects/${id}`);
              } else {
                setShowForm(false);
                setEditingSubject(null);
              }
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
