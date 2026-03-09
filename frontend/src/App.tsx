import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/Landing';
import { LoginPage, RegisterPage } from './pages/Auth';
import { StudentDashboard } from './pages/Student/Dashboard';
import { StudentEvents } from './pages/Student/Events';
import { EventDetails } from './pages/Student/EventDetails';
import { MyRegistrations } from './pages/Student/MyRegistrations';
import { FacultyDashboard } from './pages/Faculty/Dashboard';
import { FacultyEvents } from './pages/Faculty/Events';
import { CreateEvent } from './pages/Faculty/CreateEvent';
import { FacultyEventDetails } from './pages/Faculty/EventDetails';

// Root redirect component
const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <LandingPage />;
  }
  
  return user.role === 'faculty' 
    ? <Navigate to="/faculty/dashboard" replace />
    : <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Student Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/events" element={<StudentEvents />} />
            <Route path="/student/events/:eventId" element={<EventDetails />} />
            <Route path="/student/my-registrations" element={<MyRegistrations />} />
          </Route>
          
          {/* Faculty Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/events" element={<FacultyEvents />} />
            <Route path="/faculty/create-event" element={<CreateEvent />} />
            <Route path="/faculty/events/:eventId" element={<FacultyEventDetails />} />
          </Route>
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
