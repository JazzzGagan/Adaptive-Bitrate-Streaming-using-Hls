import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/signup", data);
      setServerMessage(res.data.message);
      setServerError("");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      if (err.response) {
        setServerError(err.response.data.error || "Signup failed.");
      } else {
        setServerError("Server not responding.");
      }
      setServerMessage("");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/src/assets/backgroundimage.png')" }}
    >
      <div className="relative z-1  bg-black bg-opacity-70 shadow-lg p-8 rounded-2xl max-w-md w-full">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Sign Up
        </h2>

        {serverMessage && (
          <p className="text-green-400 text-center mb-4">{serverMessage}</p>
        )}
        {serverError && (
          <p className="text-red-400 text-center mb-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20"
            />
            {errors.username && (
              <p className="text-red-300 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#00acc1] hover:bg-cyan-600 text-white font-semibold py-3 rounded"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-white hover:underline cursor-pointer">
              Sign in
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
