import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

import sipderman from ".././assets/spiderman.webp";
import minion from ".././assets/minion.jpg";
import mandolarian from ".././assets/mandalorain.jpeg";

const images = [sipderman, minion, mandolarian];

// Yup validation schema
const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/reset-password", {
        token,
        newPassword: data.password,
      });

      setMessage(res.data.message);
      setError("");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setMessage("");
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Side: Form Section */}
      <div className="w-full sm:w-1/2 h-full bg-black flex items-center justify-center">
        <div className="w-4/5 h-auto flex flex-col items-center justify-center space-y-4">
          <h2 className="text-4xl font-bold text-white text-center font-helvetica">
            Reset Password <span className="inline-block">🔐</span>
          </h2>

          {message && (
            <p className="text-green-400 text-center mb-2 font-medium">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-400 text-center mb-2 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div>
              <input
                type="password"
                placeholder="Enter new password"
                {...register("password")}
                className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20"
              />
              {errors.password && (
                <p className="text-red-300 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20"
              />
              {errors.confirmPassword && (
                <p className="text-red-300 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#00acc1] hover:bg-cyan-600 text-white font-semibold py-3 rounded flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side: Background Images */}
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
};

export default ResetPassword;
