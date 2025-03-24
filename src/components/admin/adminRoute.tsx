import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminNavBar from './NavBar/AdminNavBar';
import AdminDashboardPage from './page';
import AccountManagementPage from './AccountManagement/page';
import PaymentManagementPage from './PaymentManagement/page';
import TherapistManagementPage from './TherapistManagement/page';
import PatientManagementPage from './PatientManagement/page';
import AppointmentManagementPage from './AppointmentManagement/page';
import SubscriptionManagementPage from './SubscriptionManagement/page';
import ProtectedRoutes, { RoleProtectedRoute } from '../../routes/protectedroutes';
import { useEffect } from 'react';
import styles from './adminRoute.module.css';

const AdminRoute: React.FC = () => {
  const nav = useNavigate();

  useEffect(() => {
    const checkRole = () => {
      const role = RoleProtectedRoute();
      if (role !== 'ad') {
        nav('/login', { replace: true });
      }
    };
    checkRole();
  }, [nav]);

  return (
    <div className={styles.adminLayout}>
      <AdminNavBar />
      <main className={styles.mainContent}>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<AdminDashboardPage />} />
            <Route path="/accounts" element={<AccountManagementPage />} />
            <Route path="/payments" element={<PaymentManagementPage />} />
            <Route path="/therapists" element={<TherapistManagementPage />} />
            <Route path="/patients" element={<PatientManagementPage />} />
            <Route path="/appointments" element={<AppointmentManagementPage />} />
            <Route path="/subscriptions" element={<SubscriptionManagementPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default AdminRoute;