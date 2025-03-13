import { Outlet, Route, Routes } from 'react-router'
import RegisterPage from './page'
import RegisterSeekerPage from './PersonRegis/SeekerRegister'

export default function RegisterRoutes() {
  return (
    <Routes>
      <Route element={<Outlet/>}>
        <Route path="/" element={<RegisterPage/>} />
        <Route path="/register-seeker" element={<RegisterSeekerPage/>} />
        </Route>
    </Routes>
  )
}
