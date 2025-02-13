
import { Route, Routes } from 'react-router-dom'
import CoWorkingSpace from './components/landingpage/page'
import NotFound from './components/defaults/notfound'
import SeekerPage from './components/seeker/page'



export default function App() {
  return (
    <Routes>
      <Route path="/agent/" element={<CoWorkingSpace />} />
      <Route path='/seeker/' element={<SeekerPage/>}/>
      <Route path="*" element={<NotFound />}/>
    </Routes>
  )
}
