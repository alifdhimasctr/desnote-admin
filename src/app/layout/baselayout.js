"use client";

import React from "react";
import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import { IoLogOutSharp } from "react-icons/io5";

function BaseLayout({ children }) {

  let data = null;

  // Check if localStorage is available
  if (typeof localStorage !== 'undefined') {
    const user = localStorage.getItem("user");
    if (user) {
      data = JSON.parse(user);
    }
  }

  return (
    <div className="w-screen h-screen">
      <div className="flex flex-row ">
        <div className="w-1/6 bg-gray-900 h-screen min-w-48">
          <div className=" mt-10 flex flex-col justify-center items-center">
            <a className="mb-10">
              <img src="/DesNetLogo.png" className="" />
            </a>
            <div className="flex flex-col gap-5">
              <div className="flex flex-row items-center justify-start align-middle text-white gap-2">
                <MdDashboard />
                <a
                  href="/"
                  className="flex items-center justify-center text-sm text-white"
                >
                  DASHBOARD
                </a>
              </div>

              <div className="flex flex-row items-center justify-start align-middle text-white gap-2">
                <FaUser />
                <a
                  href="/user"
                  className="flex items-center justify-center text-white"
                >
                  User
                </a>
              </div>
            
              <div className="flex flex-row items-center justify-start align-middle text-white gap-2">
                <FaBuilding />
                <a
                  href="/department"
                  className="flex items-center justify-center text-white"
                >
                  Department
                </a>
              </div>
              
              <div className="flex flex-row items-center justify-cen align-middle text-red-500 gap-2 mt-8">
                <a
                  href="/logout"
                  className="flex items-center justify-center text-redr-500"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="w-5/6 bg-gray-100 h-screen overflow-auto">
          <div>
            <nav className="bg-gray-50 h-16 flex items-center px-10">
              <div>
                <h1 className="text-lg font-semibold">Welcome, {data.name} </h1>
              </div>
            </nav>
          </div>
          <div className="p-6 min-w-min overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default BaseLayout;
