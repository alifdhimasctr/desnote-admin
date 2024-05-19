"use client";

import React, { useState, useEffect } from "react";
import BaseLayout from "../layout/baselayout";
import axios from "axios";
import Modal from "../component/modal";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Router } from "next/router";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Department() {
  const user = localStorage.getItem("user");
  const data = JSON.parse(user);

  const [search, setSearch] = useState("");

  const [departmentData, setDepartmentData] = useState([]);
  const [status, setStatus] = useState("");
  const [departmentUpdate, setDepartmentUpdate] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showUpdateDepartment, setShowUpdateDepartment] = useState(false);
  const [showDeleteDepartment, setShowDeleteDepartment] = useState(false);

  const [departmentValue, setDepartmentValue] = useState("");

  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const pathname = usePathname();

  const { replace } = useRouter();

  function handleOpenUpdate(id) {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("id", id);
      setShowUpdateDepartment(true);
    } else {
      params.delete("id");
      setShowUpdateDepartment(false);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handleOpenDelete(id) {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("id", id);
      setShowDeleteDepartment(true);
    } else {
      params.delete("id");
      setShowDeleteDepartment(false);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const fetchDepartmentData = async () => {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + "/department/findAllDepartment",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      console.log(response.data);

      setDepartmentData(response.data.data);
      setLoading(false);
    };

    const fetchDepartmentDataById = async () => {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + `/department/findOne/${id}`
      );
      console.log(response.data);
      setDepartmentUpdate(response.data.data);
      setDepartmentValue(response.data.data.departmentName);
      setLoading(false);
    };

    if (id) {
      fetchDepartmentDataById();
    }
    fetchDepartmentData();
  }, [showAddDepartment, showUpdateDepartment, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + "/department/create-department",
      {
        departmentName: departmentValue,
      },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    console.log(response.data);

    setDepartmentValue("");
    setShowAddDepartment(false);
    toast.success("Department has been added");

  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await axios.patch(
      process.env.NEXT_PUBLIC_BASE_URL + `/department/${id}`,
      {
        departmentName: departmentValue,
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    console.log(response.data);

    setDepartmentValue(response.data.data.departmentName);
    setShowUpdateDepartment(false);
    handleOpenUpdate();
    toast.success("Department has been updated");
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BASE_URL + `/department/delete-department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    console.log(response.data);

    setDepartmentValue("");
    setShowDeleteDepartment(false);
    handleOpenDelete();
    toast.success("Department has been deleted");
  };

  return (
    <div>
      <BaseLayout>
        <h1 className="text-xl font-bold text-gray-600 mb-3">Department</h1>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between gap-8">
            <input
              type="text"
              className="w-1/5 border-2 rounded-lg p-1"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => setShowAddDepartment(true)}
              className=" bg-green-500 text-white text-sm h-max py-1 px-2 rounded"
            >
              + Add Department
            </button>
          </div>

          <table className="table-auto text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Department Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {departmentData
                .filter((department) => {
                  if (search === "") {
                    return department;
                  } else if (
                    department.departmentName
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return department;
                  }
                })
                .map((department) => (
                  <tr key={department.id} className="text-center">
                    <td className="border py-1">{departmentData.indexOf(department) + 1}</td>
                    <td className="border py-1">{department.departmentName}</td>
                    <td className="border py-1">
                    {department.status === "Active" ? <a className="text-xs p-2 rounded text-white bg-green-500">AKTIF</a> : <a className="text-xs p-2 rounded text-white bg-red-500">INAKTIF</a>}
                    </td>
                    
                    <td className="flex border py-1 gap-2 justify-center">
                      <button
                        className=" text-blue-500 hover:text-gray-500  font-bold py-2 px-3 rounded"
                        onClick={() =>
                          id
                            ? handleOpenUpdate()
                            : handleOpenUpdate(department.idDepartment)
                        }
                      >
                        <FiEdit />
                      </button>
                      
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Modal
          isVisible={showAddDepartment}
          onClose={() => setShowAddDepartment(false)}
        >
          <h1 className="text-xl font-bold text-gray-600 mb-3">
            Add Department
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Department Name"
                className="border-2 rounded-lg p-1"
                value={departmentValue}
                onChange={(e) => setDepartmentValue(e.target.value)}
              />
              <button
                type="submit"
                className="bg-green-500 text-white text-sm h-max py-1 px-2 w-max rounded"
              >
                Add
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isVisible={showUpdateDepartment}
          onClose={() => handleOpenUpdate()}
        >
          <h1 className="text-xl font-bold text-gray-600 mb-3">
            Update Department
          </h1>
          <form onSubmit={handleUpdate}>
            <div className="flex flex-col gap-2">
              <label>Nama Departemen Baru</label>
              <input
                type="text"
                placeholder="Department Name"
                className="border-2 rounded-lg p-1"
                value={departmentValue}
                onChange={(e) => setDepartmentValue(e.target.value)}
              />
              <label>Status</label>
              <select
                className="border-2 rounded-lg p-1"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">AKTIF</option>
                <option value="Inactive">TIDAK AKTIF</option>
              </select>
              <button
                type="submit"
                className="bg-green-500 text-white text-sm h-max py-1 px-2 w-max rounded"
              >
                Update
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isVisible={showDeleteDepartment}
          onClose={() => handleOpenDelete()}
        >
          <h1 className="text-xl font-bold text-gray-600 mb-3">
            Delete Department
          </h1>
          <form onSubmit={handleDelete}>
            <div className="flex flex-col gap-4">
              <h1>Are you sure want to delete Department {departmentUpdate.departmentName}</h1>
              <button
                type="submit"
                className="bg-red-500 text-white text-sm h-max py-1 px-2 w-max rounded"
              >
                Delete
              </button>
            </div>
          </form>
        </Modal>
      </BaseLayout>
      <ToastContainer />
    </div>
  );
}
