import { Route,Routes } from 'react-router-dom'

import NotFound from '../components/defaults/notfound'
import LandingPage from '../components/common/page'
import SeekerRoute from '../components/seeker/seekerRoute'
import CoWorkingRoute from '../components/coworking/coworkingRoute';
import TherapistRoute from '../components/therapist/therapistRoute';
import LoginRoutes from '../components/Login/loginRoutes';
import RegisterRoutes from '../components/Register/registerRoutes';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/register/*" element={<RegisterRoutes />} />
        <Route path="/agent/*" element={<CoWorkingRoute />} />
        <Route path='/seeker/*' element={<SeekerRoute/>}/>
        <Route path='/doctor/*' element={<TherapistRoute/>} />
      <Route path="*" element={<NotFound />}/>
    </Routes>
  )
}
