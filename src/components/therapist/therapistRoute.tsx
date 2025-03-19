import { Route,Routes, useNavigate } from "react-router";
import TherapistPage from "./page";
import { useEffect } from "react";
import { RoleProtectedRoute } from "../../routes/protectedroutes";
import SessionCreator from "./ProfessorCalendar/create-session";
import BookingInformation from "./ProfessorCalendar/page";
import PersonalInformation from "./ProfessorInfo/page";
import TherapyChatPage from "../seeker/TherapyChat/page";
import AppointmentList from "./ProfessorAppointment/appointmentList";
import AppointmentDetails from "./ProfessorAppointment/appointmentDetails";


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
        <Route path="/profile" element={<PersonalInformation />} />
        <Route path="/chat" element={<TherapyChatPage />} />
        <Route path="/session-calendar" element={<BookingInformation />} />
        <Route path="/session-calendar/create-session" element={<SessionCreator />} />
        <Route path="/appointment" element={< AppointmentList />} />
        <Route path="/appointment/:appointmentId" element={< AppointmentDetails />} />
       
   </Routes>
  )
}
