import { Navigate, Route, Routes } from 'react-router-dom';

// Components
import App from './App';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import User from './pages/user';
import Role from './pages/role';
import Permission from './pages/permission';
import Module from './pages/module';
import Group from './pages/group';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/user" element={
        <ProtectedRoute>
          <User />
        </ProtectedRoute>
      } />
      
      <Route path="/role" element={
        <ProtectedRoute>
          <Role />
        </ProtectedRoute>
      } />
      
      <Route path="/group" element={
        <ProtectedRoute>
          <Group />
        </ProtectedRoute>
      } />
      
      <Route path="/module" element={
        <ProtectedRoute>
          <Module />
        </ProtectedRoute>
      } />
      
      <Route path="/permission" element={
        <ProtectedRoute>
          <Permission />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;