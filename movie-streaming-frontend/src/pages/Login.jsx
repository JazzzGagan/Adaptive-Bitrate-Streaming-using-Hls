import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Contexts";
import sipderman from ".././assets/spiderman.webp";
import minion from ".././assets/minion.jpg";
import mandolarian from ".././assets/mandalorain.jpeg";

const images = [sipderman, minion, mandolarian];
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginFrom() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const [rememberme, setRememberme] = useState(true);
  const { setIsAuthenticated, setToken } = useContext(AuthContext);

  const handleRemember = (e) => {
    setRememberme(e.target.checked);
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/login",
        { ...data },
        { withCredentials: true }
      );

      const token = res.data.access_token;

      if (rememberme) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      setServerMessage(res.data.message);
      setServerError("");

      setToken(res.data.access_token);
      setIsAuthenticated(true);

      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (err) {
      if (err.response) {
        setServerError(err.response.data.error || "Login failed.");
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
              LOGIN <span className="inline-block">🍿</span>
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

              <div className="flex items-center">
                {/* Remove register for the checkbox, manage it manually */}
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberme}
                  onChange={handleRemember}
                  className="mr-2"
                />
                <label htmlFor="rememberMe" className="text-gray-300 text-sm">
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00acc1] hover:bg-cyan-600 text-white font-semibold py-3 rounded"
              >
                Login
              </button>
            </form>

            <p className="text-gray-300 flex flex-col text-sm mt-6 text-center">
              <Link to="/forgot-password">
                Forgot Password?
                <br />
              </Link>
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-white hover:underline cursor-pointer">
                  Sign up
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
