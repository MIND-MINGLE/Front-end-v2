import { Route,Routes } from "react-router";
import TherapistPage from "./page";


export default function TherapistRoute() {
  return (
   <Routes>
        <Route path="/" element={<TherapistPage />} />
   </Routes>
  )
}
