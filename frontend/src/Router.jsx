import { Navigate, Route, Routes } from 'react-router-dom';

//components
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
      <Route path='/' element={<App />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/group' element={<Group />} />
      <Route path='/module' element={<Module />} />
      <Route path='/permission' element={<Permission />} />
      <Route path='/role' element={<Role />} />
      <Route path='/user' element={<User />} />
    </Routes>
  )
};

export default AppRoutes