"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/admin/loginAdmin",
        {
          identifier: username,
          password,
        },
      );

      if (response.status === 201) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        toast.success("Login Success");
        router.push("/dashboard");
      }
      setErrMsg(null);
    } catch (error) {
      console.log(error.response.data.message, "ini error");
      toast.error("Login Failed");
    }
  };

  return (
    <div className="bg-gray-200 w-full h-[100vh] flex items-center justify-center overflow-auto">
      <div className="flex">
        <div className="bg-white p-8 py-14 rounded-l-xl w-80">
          <h1 className="text-2xl text-black font-semibold mb-4">Login</h1>
          <form action={handleLogin}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Email"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errMsg && <p className="text-red-500 text-xs italic">{errMsg}</p>}
            <div className="flex items-center justify-between">
              <input
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                // onClick={(e) => e.preventDefault()}
                value="Sign in"
              />
            </div>
          </form>
        </div>
        <div className="p-8 flex items-center justify-center rounded-r-xl w-80 bg-blue-700 text-white">
          <div className="flex flex-col items-center">
            <img src="/DesNetLogo.png" className="mb-4" />
            <h1 className="text-2xl font-semibold text-center mb-4">
              Welcome Back
            </h1>
            <p className="text-white text-center">
              DesNet. Sebuah Aplikasi Notulensi yang memudahkan dalam mencatat
              dan mengelola notulensi rapat.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
