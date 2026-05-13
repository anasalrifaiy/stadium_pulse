import { HashRouter as BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { GameProvider, useGame } from './contexts/GameContext'
import LoginPage from './pages/LoginPage'
import HostDashboard from './pages/HostDashboard'
import ContestantView from './pages/ContestantView'
import Scoreboard from './pages/Scoreboard'

// Checks localStorage directly so there's no flash-redirect before context loads
function ProtectedHost({ children }) {
  const role = localStorage.getItem('sp_role')
  const gameId = localStorage.getItem('sp_gameId')
  if (role === 'host' && gameId) return children
  return <Navigate to="/" replace />
}

function ProtectedPlayer({ children }) {
  const role = localStorage.getItem('sp_role')
  const gameId = localStorage.getItem('sp_gameId')
  if (role === 'player' && gameId) return children
  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/host" element={<ProtectedHost><HostDashboard /></ProtectedHost>} />
          <Route path="/play" element={<ProtectedPlayer><ContestantView /></ProtectedPlayer>} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  )
}
