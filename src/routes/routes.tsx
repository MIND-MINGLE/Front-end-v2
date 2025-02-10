import React from 'react'
import { Route } from 'react-router-dom'
import LandingPage from '../components/landingpage/page'

export default function routes() {
  return (
    <div>
      routes
      <Route path="/" element={<LandingPage />} />
    </div>
  )
}
