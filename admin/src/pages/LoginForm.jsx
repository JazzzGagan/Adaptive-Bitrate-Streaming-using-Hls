import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
})

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const [serverError, setServerError] = useState('')

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      setServerError('')
      await axios.post('http://127.0.0.1:5000/admin/login', data, {
        withCredentials: true,
      })

      toast.success('Login successful!', {
        position: 'top-center',
        duration: 1000,
      })
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="w-full sm:w-[400px] p-8 bg-white/5 text-white rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>

        {serverError && (
          <p className="text-red-400 text-center mb-4">{serverError}</p>
        )}
        {/*  {serverMessage && (
          <p className="text-green-400 text-center mb-4">{serverMessage}</p>
        )} */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register('username')}
              className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-cyan-500"
            />
            {errors.username && (
              <p className="text-red-300 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-cyan-500"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
