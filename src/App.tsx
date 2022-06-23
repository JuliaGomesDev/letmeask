import { Route, Routes } from 'react-router-dom'

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import { Room } from './pages/Room'

import { AuthContextProvider } from './contexts/AuthContext'
import { AdminRoom } from './pages/AdminRoom'

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/rooms/new" element={<NewRoom />}></Route>
        <Route path="/rooms/:id" element={<Room></Room>}></Route>
        <Route
          path="/admin/rooms/:id"
          element={<AdminRoom></AdminRoom>}
        ></Route>
      </Routes>
    </AuthContextProvider>
  )
}

export default App
