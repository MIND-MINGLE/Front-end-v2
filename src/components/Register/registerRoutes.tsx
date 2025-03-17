import { Outlet, Route, Routes } from 'react-router'
import RegisterPage from './page'
import RegisterSeekerPage from './PersonRegis/SeekerRegister'
import RegisterDoctorPage from './PersonRegis/DoctorRegister'
import RegisterAgentPage from './PersonRegis/AgentRegister'
import SessionRegister from './PersonRegis/SessionRegister'

export default function RegisterRoutes() {
  return (
    <Routes>
      <Route element={<Outlet/>}>
        <Route path="/" element={<RegisterPage/>} />
        <Route path="/register-seeker" element={<RegisterSeekerPage/>} />
        <Route path="/register-doctor" element={<RegisterDoctorPage/>} />
        <Route path="/register-agent" element={<RegisterAgentPage/>} />
        <Route path="/session-register" element={<SessionRegister/>} />
        </Route>
    </Routes>
  )
}
