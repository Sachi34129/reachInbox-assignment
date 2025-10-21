import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import InboxPage from './pages/InboxPage'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-[#0b1120] text-gray-200 p-4">
        <Routes>
          <Route path="/" element={<InboxPage />} />
        </Routes>
      </div>
    </div>
  )
}