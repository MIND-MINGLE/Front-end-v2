import { Route, Routes } from 'react-router'
import SeekerPage from './page'


export default function SeekerRoute() {
  return (
    <Routes>
      <Route path='/seeker/' element={<SeekerPage/>}/>
    </Routes>
    
   
  )
}
