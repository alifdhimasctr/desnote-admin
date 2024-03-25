"use client";

import axios from "axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import BaseLayout from "../layout/baselayout";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Modal from "../component/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function User() {
  let data = null;

  if (typeof localStorage !== 'undefined') {
    const user = localStorage.getItem("user");
    if (user) {
      data = JSON.parse(user);
    }
  }

  const [search, setSearch] = useState("");

  const [userData, setUserData] = useState([]);
  const [userUpdate, setUserUpdate] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);

  const [departmentData, setDepartmentData] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");

  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const pathname = usePathname();

  const { replace } = useRouter();

  function handleOpenUpdate(id) {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("id", id);
      setShowUpdateUser(true);
    } else {
      params.delete("id");
      setShowUpdateUser(false);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handleOpenDelete(id) {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("id", id);
      setShowDeleteUser(true);
    } else {
      params.delete("id");
      setShowDeleteUser(false);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + "/admin/findAllUser",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      console.log(response.data);

      setUserData(response.data.data);
      setLoading(false);
    };

    const fetchDataById = async () => {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + `/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      console.log(response.data);
      setUserUpdate(response.data.data);
      setName(response.data.data.name);
      setEmail(response.data.data.email);
      setPhone(response.data.data.phone);
      setDepartment(response.data.data.department.idDepartment);
      setRole(response.data.data.role);



      setLoading(false);
    };

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
    fetchData();
    if (id) {
      fetchDataById();
    }
    fetchDepartmentData();
  }, [showAddUser, showUpdateUser, showDeleteUser, id]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + "/admin/createUser",
      {
        name: name,
        email: email,
        phone: phone,
        idDepartments: department,
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    console.log(response.data);
    setName("");
    setEmail("");
    setPhone("");
    setDepartment(null);
    setRole("");
    setShowAddUser(false);
    toast.success("User berhasil ditambahkan");
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const response = await axios.patch(
      process.env.NEXT_PUBLIC_BASE_URL + `/admin/updateUser/${id}`,
      {
        name: name,
        email: email,
        phone: phone,
        idDepartments: department,
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    console.log(response.data);
    setName("");
    setEmail("");
    setPhone("");
    setDepartment(null);
    setRole("");
    setShowUpdateUser(false);
    handleOpenUpdate();
    toast.success("User berhasil diubah");
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BASE_URL + `/admin/deleteUser/${id}`,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    console.log(response.data);
    setName("");
    setEmail("");
    setPhone("");
    setDepartment(null);
    setRole("");
    setShowDeleteUser(false);
    handleOpenDelete();
    toast.success("User berhasil dihapus");
  };

  return (
    <div>
      <BaseLayout>
        <h1 className="text-xl font-bold text-gray-600 mb-3">User</h1>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between gap-8">
            <Suspense>
            <input
              type="text"
              className="w-1/5 border-2 rounded-lg p-1"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            </Suspense>
            <button
              onClick={() => setShowAddUser(true)}
              className=" bg-green-500 text-white text-sm h-max py-1 px-2 rounded"
            >
              + Add User
            </button>
          </div>

          <table className="table-auto">
            <thead className="bg-gray-200">
              <tr className="">
                <th className="text-center">No</th>
                <th className="text-center">Nama</th>
                <th className="text-center">Username</th>
                <th className="text-center">Email</th>
                <th className="text-center">Nomor Telepon</th>
                <th className="text-center">Role</th>
                <th className="text-center">Departemen</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {userData
                .filter((user) => {
                  if (search === "") {
                    return user;
                  } else if (
                    user.name.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return user;
                  } else if (
                    user.email.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return user;
                  } else if (
                    user.department.departmentName
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return user;
                  } else if (
                    user.role.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return user;
                  }
                })
                .map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="border py-1">
                      {userData.indexOf(user) + 1}
                    </td>
                    <td className="border py-1">{user.name}</td>
                    <td className="border py-1">{user.username}</td>
                    <td className="border py-1">{user.email}</td>
                    <td className="border py-1">{user.phone}</td>
                    <td className="border py-1">{user.role}</td>
                    <td className="border py-1">
                      {user.department.departmentName}
                    </td>
                    <td className="flex border py-1 gap-2 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded"
                        onClick={() =>
                          id ? handleOpenUpdate() : handleOpenUpdate(user.id)
                        }
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                        onClick={() =>
                          id ? handleOpenDelete() : handleOpenDelete(user.id)
                        }
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Modal isVisible={showAddUser} onClose={() => setShowAddUser(false)}>

          <h1 className="text-xl font-bold text-gray-600 mb-3">Add User</h1>
          <form onSubmit={handleAddUser}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nama
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Nama"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Nomor Telepon
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="text"
                placeholder="Nomor Telepon"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Departemen
              </label>
              <select
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="department"
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option disabled selected>
                  Pilih Departemen
                </option>
                {departmentData.map((department) => (
                  <option
                    key={department.idDepartment}
                    value={department.idDepartment}
                  >
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="role"
              >
                Role
              </label>
              <select
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="role"
                onChange={(e) => setRole(e.target.value)}
              >
                <option disabled selected>
                  Pilih Role
                </option>
                <option value="STAFF">Staff</option>
                <option value="PIMPINAN">Pimpinan</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isVisible={showUpdateUser}
          onClose={() => handleOpenUpdate()}
        >
          <h1 className="text-xl font-bold text-gray-600 mb-3">Update User</h1>
          <form onSubmit={handleUpdateUser}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nama
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Nama"
                disabled
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="Email"
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Nomor Telepon
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="text"
                placeholder="Nomor Telepon"
                disabled
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Departemen
              </label>
              <select
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option disabled selected>
                  Pilih Departemen
                </option>
                {departmentData.map((department) => (
                  <option
                    key={department.departmentName}
                    value={department.idDepartment}
                  >
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="role"
              >
                Role
              </label>
              <select
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option disabled selected>
                  Pilih Role
                </option>
                <option value="STAFF">Staff</option>
                <option value="PIMPINAN">Pimpinan</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </Modal>
        <Modal isVisible={showDeleteUser} onClose={() =>handleOpenDelete()}>
          <h1 className="text-xl font-bold text-gray-600 mb-3">
            Apakah Anda yakin ingin menghapus {userUpdate.name}?
          </h1>
          <div className="flex items-center justify-between">
            <button
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleDeleteUser}
            >
              Hapus
            </button>
          </div>
        </Modal>
      </BaseLayout>
      <ToastContainer />
    </div>
  );
}
