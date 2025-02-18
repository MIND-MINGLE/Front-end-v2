
import { Routes,Route, useNavigate } from 'react-router'
import CoWorkingSpace from './page'
import { useEffect } from 'react'
import { RoleProtectedRoute } from '../../routes/protectedroutes'

export default function CoWorkingRoute() {
  const nav = useNavigate()
  useEffect(()=>{
    const checkRole = () =>{
      const role = RoleProtectedRoute()
      if(role !== "agent"){
        nav("/login",{replace:true})
      }
    }
    checkRole();
  },[])
  return (
    <Routes>
        <Route path="/" element={<CoWorkingSpace />} />
    </Routes>
  )
}
