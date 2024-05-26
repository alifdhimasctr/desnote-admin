"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import { stringify } from "postcss";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const [token, setToken] = useCookies(["token"]);
  const [user, setUser] = useCookies(["user"]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/admin/loginAdmin",
        {
          identifier: username,
          password,
        }
      );

      if (response.status === 201) {
        setToken("token", response.data.data.token, {
          path: "/",
          maxAge: 1000000000,
          sameSite: true,
        });
        console.log("ini token");
        console.log(response.data.data.token);
        setUser("user", response.data.data, {
          maxAge: 1000000000,
          path: "/",
          sameSite: true,
        });
        console.log(response.data.data);
        toast.success("Login Success");
        router.push("/dashboard");
      }
      setErrMsg(null);
    } catch (error) {
      console.log(error.response.data.message, "ini error");
      toast.error("Username & Password tidak sesuai");
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 w-full h-[100vh] flex items-center justify-center overflow-auto">
      <div className="flex">
        <div className="flex flex-col bg-white p-6 rounded-l-xl w-80">
          <img src="/DesNetLogo.png" className="w-40 items-center justify-center mb-4 self-center" />
          <h1 className="text-2xl text-black font-semibold mb-2">Login</h1>
          <form action={handleLogin}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                E-mail
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
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
            <div className="flex items-center justify-between">
              {loading ? (
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  disabled
                >
                  Sign In...
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign In
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="p-8 flex items-center justify-center rounded-r-xl w-80 bg-blue-700 text-white">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center mb-4">
              DesNote.
            </h1>
            <p className="text-white text-center">
              Sebuah Aplikasi Notulensi yang memudahkan dalam mencatat
              dan mengelola notulensi rapat.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
