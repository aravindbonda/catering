import { Navigate } from 'react-router-dom';

function AdminLogin() {
  return <Navigate to="/login" replace state={{ role: 'admin' }} />;
}

export default AdminLogin;
