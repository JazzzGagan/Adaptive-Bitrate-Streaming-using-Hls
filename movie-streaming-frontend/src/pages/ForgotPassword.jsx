import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import sipderman from ".././assets/spiderman.webp";
import minion from ".././assets/minion.jpg";
import mandolarian from ".././assets/mandalorain.jpeg";

const images = [sipderman, minion, mandolarian];

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
    <div className="w-full h-screen flex">
      {/* Left Panel */}
      <div className="w-full sm:w-1/2 h-full bg-black flex items-center justify-center">
        <div className="w-4/5 h-auto sm:h-3/4 flex flex-col items-center justify-center space-y-4">
          <div className="w-4/5 h-auto flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-helvetica text-center">
              Forgot Password?
            </h1>
            <p className="text-sm text-gray-300 text-center mt-2">
              Enter your email to receive a reset link.
            </p>
          </div>

          {message && (
            <p className="text-green-400 text-center mb-2 text-sm">
              Reset link:{" "}
              <a
                href={message}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-300"
              >
                Click here
              </a>
            </p>
          )}

          {error && (
            <p className="text-red-400 text-center mb-2 text-sm">{error}</p>
          )}

          <div className="w-4/5 h-auto flex flex-col">
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

            <p className="text-gray-300 text-sm mt-6 text-center">
              Remembered your password?{" "}
              <Link to="/login">
                <span className="text-white hover:underline cursor-pointer">
                  Login
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-slate-900 text-white hidden md:flex flex-row items-center justify-center">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`img-${i}`}
            className="w-1/3 h-screen object-cover border border-background2"
          />
        ))}
      </div>
    </div>
  );
}
