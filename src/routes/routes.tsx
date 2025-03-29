import { Route, Routes } from 'react-router-dom'

import NotFound from '../components/defaults/notfound'
import LandingPage from '../components/common/page'
import SeekerRoute from '../components/seeker/seekerRoute'
import CoWorkingRoute from '../components/coworking/coworkingRoute';
import TherapistRoute from '../components/therapist/therapistRoute';
import LoginRoutes from '../components/Login/loginRoutes';
import RegisterRoutes from '../components/Register/registerRoutes';
import AdminRoute from '../components/admin/adminRoute';
import GlobalCounter from '../services/globalCounter';
import PaymentStatusCheck from '../components/common/paymentStatusCheck';

export default function AppRoutes() {
  return (
    <>
    <GlobalCounter/>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* There is a query here too: ?paymentStatus=true/false */}
      <Route path="/payment/:paymentId" element={<PaymentStatusCheck />} /> 
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/register/*" element={<RegisterRoutes />} />
      <Route path="/agent/*" element={<CoWorkingRoute />} />
      <Route path='/seeker/*' element={<SeekerRoute />} />
      <Route path='/doctor/*' element={<TherapistRoute />} />
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}
