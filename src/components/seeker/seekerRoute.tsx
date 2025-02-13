import { Route, Routes } from 'react-router'
import SeekerPage from './page'
import EventPage from './EventPage/page'
import HistoryPage from './HistoryPage/page'
import ProfileSeekerPage from './ProfileSeeker/page'
import TherapyChatPage from './TherapyChat/page'
import CallNoVideoPage from './TherapyChat/CallNoVideo/page'
import CallVideoPage from './TherapyChat/CallVideo/page'
import MusicSelectPage from './TherapyChat/MusicSelect/page'

export default function SeekerRoute() {
  return (
    <Routes>
      <Route path='/' element={<SeekerPage />} />
      <Route path='/events' element={<EventPage />} />
      <Route path='/history' element={<HistoryPage />} />
      <Route path='/profile' element={<ProfileSeekerPage />} />
      <Route path='/therapy-chat' element={<TherapyChatPage />} />
      <Route path='/therapy-chat/call-no-video' element={<CallNoVideoPage />} />
      <Route path='/therapy-chat/call-video' element={<CallVideoPage />} />
      <Route path='/therapy-chat/music-select' element={<MusicSelectPage />} />
    </Routes>
  )
}