
import { Routes,Route } from 'react-router'
import CoWorkingSpace from './page'

export default function CoWorkingRoute() {
  return (
    <Routes>
        <Route path="/" element={<CoWorkingSpace />} />
    </Routes>
  )
}
