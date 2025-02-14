
import { Route, Routes } from 'react-router'
import LoginPage from './page'
import ChangePassword from './ChangePassword/ChangePassForm'

export default function LoginRoutes() {
  return (
    <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/changepassword" element={<ChangePassword/>} />
    </Routes>
  )
}
