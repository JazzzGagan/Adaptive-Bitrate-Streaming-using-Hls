import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/admin/check-auth', { withCredentials: true })
      .then(() => setAuth(true))
      .catch(() => setAuth(false))
  }, [])

  if (auth === null) return <div>Loading...</div>
  return auth ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoutes
