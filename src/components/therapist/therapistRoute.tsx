import { Route,Routes, useNavigate } from "react-router";
import TherapistPage from "./page";
import { useEffect } from "react";
import { RoleProtectedRoute } from "../../routes/protectedroutes";


export default function TherapistRoute() {
  const nav = useNavigate()
  useEffect(()=>{
    const checkRole = () =>{
      const role = RoleProtectedRoute()
      if(role !== "doc"){
        nav("/login",{replace:true})
      }
    }
    checkRole();
  },[])
  return (
   <Routes>
        <Route path="/" element={<TherapistPage />} />
   </Routes>
  )
}
