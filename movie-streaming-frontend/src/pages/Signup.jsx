import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import sipderman from ".././assets/spiderman.webp";
import minion from ".././assets/minion.jpg";
import mandolarian from ".././assets/mandalorain.jpeg";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import avatarList from "../Utils/avatarList";

const images = [sipderman, minion, mandolarian];
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email format")
    .required("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address")
    .max(254, "Email must be 254 characters or less"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  dob: yup
    .date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Date of birth is required")
    .typeError("Date of birth is required"),
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

  const getRandomAvatar = () => {
    const index = Math.floor(Math.random() * avatarList.length);
    return avatarList[index];
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        avatar: getRandomAvatar(),
      };
<<<<<<< HEAD
      const res = await axios.post("http://localhost:5000/signup", payload);
=======
      const res = await axios.post("http://127.0.0.1:5000/signup", payload);
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
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
    <div className="w-full h-screen flex">
      <div className="w-full sm:w-1/2 h-full bg-black flex items-center justify-center ">
        <div className="w-4/5 h-2/3 sm:h-4/5 flex flex-col items-center justify-center space-y-4 ">
          <div className="w-4/5 h-auto flex flex-col ">
            <h1 className="text-5xl  font-bold text-white font-helvetica">
              SIGN UP <span className="inline-block">🍿</span>
            </h1>
          </div>

          {serverMessage && (
            <p className="text-green-400 text-center mb-4">{serverMessage}</p>
          )}
          {serverError && (
            <p className="text-red-400 text-center mb-4">{serverError}</p>
          )}
          <div className="w-4/5 h-2/3 flex flex-col">
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
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20"
                />
                {errors.confirmPassword && (
                  <p className="text-red-300 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="date"
                  placeholder="Date of Birth"
                  {...register("dob")}
                  className="w-full p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20   appearance-none"
                />

                {errors.dob && (
                  <p className="text-red-300 text-sm mt-1">
                    {errors.dob.message}
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
      </div>
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-slate-900 text-white hidden md:flex flex-row items-center justify-center">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`img-${i}`}
            className="w-1/3 h-screen object-cover border border-background2 "
          />
        ))}
      </div>
    </div>
  );
}
