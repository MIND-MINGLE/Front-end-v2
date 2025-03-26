import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './AdminNavBar.module.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LogoutIcon from '@mui/icons-material/Logout';
import { Accountlogout } from '../../../services/logout';

const AdminNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Accountlogout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Admin Dashboard</h2>
      <ul className={styles.nav}>
        <li className={styles.navItem}>
          <Link to="/admin" className={`${styles.navLink} ${isActive('/admin')}`}>
            <DashboardIcon className={styles.icon} />
            Dashboard
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/admin/accounts" className={`${styles.navLink} ${isActive('/admin/accounts')}`}>
            <PeopleIcon className={styles.icon} />
            Manage Accounts
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/admin/payments" className={`${styles.navLink} ${isActive('/admin/payments')}`}>
            <PaymentIcon className={styles.icon} />
            Manage Payments
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/admin/therapists" className={`${styles.navLink} ${isActive('/admin/therapists')}`}>
            <PsychologyIcon className={styles.icon} />
            Manage Therapists
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/admin/patients" className={`${styles.navLink} ${isActive('/admin/patients')}`}>
            <PersonIcon className={styles.icon} />
            Manage Patients
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/admin/appointments" className={`${styles.navLink} ${isActive('/admin/appointments')}`}>
            <EventIcon className={styles.icon} />
            Manage Appointments
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/admin/subscriptions" className={`${styles.navLink} ${isActive('/admin/subscriptions')}`}>
            <SubscriptionsIcon className={styles.icon} />
            Manage Subscriptions
          </Link>
        </li>
        <li className={styles.navItem}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogoutIcon className={styles.logoutIcon} />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminNavBar;