import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address"
    ),
});

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/forgot-password",
        data
      );
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setMessage("");
      if (err.response) {
        setError(err.response.data.error || "Something went wrong.");
      } else {
        setError("Server not responding.");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/src/assets/backgroundimage.png')" }}
    >
      <div className="relative z-1 bg-black bg-opacity-70 shadow-lg p-8 rounded-2xl max-w-md w-full">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        {message && (
          <p className="text-green-400 text-center mb-4">
            Reset link:{" "}
            <a
              href={message}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300"
            >
              Click here to reset your password
            </a>
          </p>
        )}

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#00acc1] hover:bg-cyan-600 text-white font-semibold py-3 rounded"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
