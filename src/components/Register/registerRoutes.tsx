import { Route, Routes } from 'react-router'
import RegisterPage from './page'

export default function RegisterRoutes() {
  return (
    <Routes>
        <Route path="/" element={<RegisterPage/>} />
    </Routes>
  )
}
