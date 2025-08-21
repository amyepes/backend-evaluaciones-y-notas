import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./admin/pages/AdminDashboard";
import UsersPage from "./admin/pages/UsersPage";
import SubjectsPage from "./admin/pages/SubjectsPage";
import SubjectDetailsPage from "./admin/pages/SubjectDetailsPage";
import AdminStatsPage from "./admin/pages/AdminStatsPage";
import QuizzesPage from "./admin/pages/QuizzesPage";
import GradingPage from "./admin/pages/GradingPage";
import StudentDashboard from "./student/pages/StudentDashboard";
import SubjectQuizzesPage from "./student/pages/SubjectQuizzesPage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/subjects" element={
          <ProtectedRoute>
            <SubjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/subjects/:id" element={
          <ProtectedRoute>
            <SubjectDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/subjects/edit/:id" element={
          <ProtectedRoute>
            <SubjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/stats" element={
          <ProtectedRoute>
            <AdminStatsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/quizzes" element={
          <ProtectedRoute>
            <QuizzesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/grading" element={
          <ProtectedRoute>
            <GradingPage />
          </ProtectedRoute>
        } />
        <Route path="/student" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/subject/:subjectId/quizzes" element={
          <ProtectedRoute>
            <SubjectQuizzesPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
