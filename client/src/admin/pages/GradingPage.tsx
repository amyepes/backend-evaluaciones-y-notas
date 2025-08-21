import { useState } from "react";
import { useAppContext } from "@/context/useAppContext";
import NavComponent from "@/components/NavComponent";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen,
  Users,
  FileText
} from "lucide-react";
import { useCalifications } from "../hooks/useCalifications";
import CalificationForm from "../components/CalificationForm"; 
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function GradingPage() {
  const { user } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingCalification, setEditingCalification] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { califications, loading, createCalification, updateCalification, deleteCalification } = useCalifications({
    page: currentPage.toString(),
    search: searchTerm,
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  const handleCreateCalification = async (calificationData: any) => {
    const success = await createCalification(calificationData);
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateCalification = async (calificationData: any) => {
    if (editingCalification) {
      const success = await updateCalification(editingCalification.id, calificationData);
      if (success) {
        setEditingCalification(null);
        setShowForm(false);
      }
    }
  };

  const handleDeleteCalification = async (calificationId: number) => {
    const success = await deleteCalification(calificationId);
    if (success && currentPage > 1 && califications?.califications.length === 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (calification: any) => {
    setEditingCalification(calification);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCalification(null);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 bg-green-50";
    if (grade >= 80) return "text-blue-600 bg-blue-50";
    if (grade >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavComponent />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="h-12 w-12 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold">Gestión de Calificaciones</h1>
                  <p className="text-orange-100 mt-2">
                    Administra las calificaciones de estudiantes en evaluaciones.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Calificación
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar calificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Califications List */}
        <div className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : califications && califications.califications.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estudiante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evaluación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Materia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Calificación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profesor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {califications.califications.map((calification) => (
                      <tr key={calification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {calification.student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{calification.student.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-purple-600 mr-2" />
                            <div className="text-sm text-gray-900">
                              {calification.quiz.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 text-green-600 mr-2" />
                            <div className="text-sm text-gray-900">
                              {calification.quiz.subject.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(calification.grade)}`}>
                            <Award className="h-4 w-4 mr-2" />
                            {calification.grade}/100
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {calification.quiz.subject.professor.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(calification)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar calificación?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la calificación de {calification.student.name} en "{calification.quiz.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCalification(calification.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {califications.pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      Mostrando página {califications.pagination.page} de {califications.pagination.totalPages}
                      {" "}({califications.pagination.total} calificaciones en total)
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!califications.pagination.hasPrev}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!califications.pagination.hasNext}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron calificaciones
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? "No hay calificaciones que coincidan con tu búsqueda." : "Comienza creando tu primera calificación."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Calificación
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Calification Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <CalificationForm
                calification={editingCalification}
                onSubmit={editingCalification ? handleUpdateCalification : handleCreateCalification}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
