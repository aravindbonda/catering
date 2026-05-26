import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import PartnerRegister from './pages/PartnerRegister';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import VerifyPartnerOtp from './pages/VerifyPartnerOtp';
import ForgotPassword from './pages/ForgotPassword';
import FoodSelection from './pages/FoodSelection';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import './App.css';

const ProtectedRoute = ({ children, admin = false, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loader">Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

function AppRoutes() {
  return (
    <>
      <div className="app-shell">
        <Navbar />
        <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<FoodSelection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-partner" element={<PartnerRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/verify-partner-otp" element={<VerifyPartnerOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/book" element={<ProtectedRoute><FoodSelection /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id/confirmed" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/partner" element={<ProtectedRoute role="partner"><PartnerDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
