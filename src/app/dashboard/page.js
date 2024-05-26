"use client";

import axios from "axios";
import Image from "next/image";
import React, {useState, useEffect} from "react";
import BaseLayout from "../layout/baselayout";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { stringify } from "postcss";


export default function Dashboard() {

  const user = localStorage.getItem("user");
  const data = JSON.parse(user);

  const [search, setSearch] = useState("");

  const [staffData, setStaffData] = useState([]);
  const [pimpinanData, setPimpinanData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);

      const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/staff/findAllStaffRevamp?name=", {
        headers: {
          Authorization: `Bearer ${(data.token)}`
        }
      });
      console.log(response.data);
      
      setStaffData(response.data.data);
      setLoading(false);  
    }

    const fetchPimpinanData = async () => {
      setLoading(true);

      const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/pimpinan/findAllPimpinan", {
        headers: {
          Authorization: `Bearer ${(data.token)}`
        }
      });
      console.log(response.data);
      
      setPimpinanData(response.data.data);
      setLoading(false);
    }

    const fetchDepartmentData = async () => {
      setLoading(true);

      const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/department/findAllDepartment", {
        headers: {
          Authorization: `Bearer ${(data.token)}`
        }
      });
      console.log(response.data);
      
      setDepartmentData(response.data.data);
      setLoading(false);
    }
    fetchStaffData();
    fetchPimpinanData();
    fetchDepartmentData();
  }, []);

  return (
    <div>
      <BaseLayout>
      <h1 className="text-xl font-bold text-gray-600 mb-3">Dashboard</h1>

      <div className="flex flex-row gap-4">
        <div className="w-1/3 bg-white p-4 rounded-lg">
          <h1 className="text-xl font-bold text-gray-600 mb-3">Total Staff</h1>
          <h1 className="text-3xl font-bold text-gray-600 mb-3">{staffData.length}</h1>
        </div>
        <div className="w-1/3 bg-white p-4 rounded-lg">
          <h1 className="text-xl font-bold text-gray-600 mb-3">Total Pimpinan</h1>
          <h1 className="text-3xl font-bold text-gray-600 mb-3">{pimpinanData.length}</h1>
        </div>
        <div class="w-1/3 bg-white p-4 rounded-lg">
          <h1 className="text-xl font-bold text-gray-600 mb-3">Total Departemen</h1>
          <h1 class="text-3xl font-bold text-gray-600 mb-3">{departmentData.length}</h1>
        </div>
      </div>
      </BaseLayout>
    </div>
  );
}
