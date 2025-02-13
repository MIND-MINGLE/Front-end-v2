import { Route,Routes } from 'react-router-dom'
import CoWorkingSpace from '../components/landingpage/page'
import NotFound from '../components/defaults/notfound'
import SeekerPage from '../components/seeker/page'
import LandingPage from '../components/common/page'
import TherapistPage from '../components/therapist/page'


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/agent/" element={<CoWorkingSpace />} />
      <Route path='/seeker/' element={<SeekerPage/>}/>
      <Route path='/doctor/' element={<TherapistPage/>} />
      <Route path="*" element={<NotFound />}/>
    </Routes>
  )
}
