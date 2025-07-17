import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './authContext';
import Login from './pages/Login';
import Supervisor from './pages/Supervisor';
import Admin from './pages/Admin';
import ProtectedRoute from './ProtectedRoute';
import PankajData from './pages/PankajData';
import SupervisorMahendergarh from './pages/SupervisorMahendergarh';
import SupervisorNarnaul from './pages/SupervisorNarnaul';
import SupervisorRewari from './pages/SupervisorRewari';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Admin & Supervisor Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/supervisor" element={<Supervisor />} />
          <Route path="/supervisor/:name" element={<PankajData />} />
        </Route>

        {/* 🔐 Mahendergarh Supervisor Route */}
        <Route element={<ProtectedRoute allowedRole="supervisor_mahendergarh" />}>
          <Route path="/supervisor_mahendergarh" element={<SupervisorMahendergarh />} />
        </Route>

        {/* 🔐 Narnaul Supervisor Route */}
        <Route element={<ProtectedRoute allowedRole="supervisor_narnaul" />}>
          <Route path="/supervisor_narnaul" element={<SupervisorNarnaul />} />
        </Route>

        {/* 🔐 Rewari Supervisor Route */}
        <Route element={<ProtectedRoute allowedRole="supervisor_rewari" />}>
          <Route path="/supervisor_rewari" element={<SupervisorRewari />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
