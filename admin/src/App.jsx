import { Routes, Route } from 'react-router-dom'
import Login from './pages/LoginForm'
import DashBoard from './Components/DashBoard//DashBoard'
import Layout from './Components/Layout/Layout'
import UploadMovies from './pages/UploadMovies'
import Users from './pages/Users'
import PrivateRoutes from './Utils/PrivateRoutes'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashBoard />} />
            <Route path="uploadmovies" element={<UploadMovies />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
