import { Route,Routes, useNavigate } from "react-router";
import TherapistPage from "./page";
import { useEffect } from "react";
import { RoleProtectedRoute } from "../../routes/protectedroutes";
import PersonalInformation from "./ProfessorCalendar/page";
import SessionCreator from "./ProfessorCalendar/create-session";


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
        <Route path="/session-calendar" element={<PersonalInformation />} />
        <Route path="/session-calendar/create-session" element={<SessionCreator />} />
   </Routes>
  )
}
