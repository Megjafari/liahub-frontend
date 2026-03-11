import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import SavedJobsPage from './pages/SavedJobsPage.tsx'
import ApplicationsPage from './pages/ApplicationsPage.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="sparade" element={<SavedJobsPage />} />
          <Route path="ansokningar" element={<ApplicationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)