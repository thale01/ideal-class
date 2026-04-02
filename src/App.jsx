import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { ThemeProvider } from './context/ThemeContext';
import { QuizProvider } from './context/QuizContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import { AdmissionProvider } from './context/AdmissionContext';
import { FeeProvider } from './context/FeeContext';
import { GalleryProvider } from './context/GalleryContext';
import { UpdateProvider } from './context/UpdateContext';
import { DoubtProvider } from './context/DoubtContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Admission from './pages/AdmissionForm';
import TeacherDashboard from './pages/admin/AdminDashboard';
import SubjectPage from './pages/admin/SubjectPage';
import ManageCourse from './pages/ManageCourse';
import StudentDashboard from './pages/StudentDashboard';
import CourseViewer from './pages/CourseViewer';
import QuizPlayer from './pages/QuizPlayer';
import Gallery from './pages/Gallery';
import Courses from './pages/Courses';
import Achievements from './pages/Achievements';
import Navbar from './components/Navbar';
import Privacy from './pages/Privacy';


const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/student') || 
                      location.pathname.startsWith('/manage-course');

  return (
    <div className="min-h-screen bg-main transition-colors duration-500">
      {user && !isDashboard && <Navbar />}
      <main className={isDashboard ? "w-full" : "container py-8"}>{children}</main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <QuizProvider>
            <AnnouncementProvider>
              <UpdateProvider>
                <AdmissionProvider>
                <FeeProvider>
                  <GalleryProvider>
                  <DoubtProvider>
                    <Router>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admission" element={<Admission />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/achievements" element={<Achievements />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute role="admin">
                              <MainLayout>
                                <TeacherDashboard />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/subject/:id"
                          element={
                            <ProtectedRoute role="admin">
                              <MainLayout>
                                <SubjectPage />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        {/* Catch-all for other admin routes to prevent blank screens */}
                        <Route
                          path="/admin/*"
                          element={
                            <ProtectedRoute role="admin">
                              <MainLayout>
                                <TeacherDashboard />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/manage-course/:id"
                          element={
                            <ProtectedRoute role="admin">
                              <MainLayout>
                                <ManageCourse />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/student"
                          element={
                            <ProtectedRoute role="student">
                              <MainLayout>
                                <StudentDashboard />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/student/course/:id"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <CourseViewer />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/quiz/:id"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <QuizPlayer />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        {/* Final Global Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Router>
                  </DoubtProvider>
                  </GalleryProvider>
                </FeeProvider>
              </AdmissionProvider>
            </UpdateProvider>
          </AnnouncementProvider>
          </QuizProvider>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}



export default App;
