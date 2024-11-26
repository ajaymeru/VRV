import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddUser.scss";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    role: "",
    permissions: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const allPermissions = [
    { id: "createPost", label: "Create Post" },
    { id: "editPost", label: "Edit Post" },
    { id: "deletePost", label: "Delete Post" },
    { id: "viewReports", label: "View Reports" },
    { id: "manageUsers", label: "Manage Users" },
    { id: "assignTasks", label: "Assign Tasks" },
    { id: "approveRequests", label: "Approve Requests" },
    { id: "accessRestrictedAreas", label: "Access Restricted Areas" },
    { id: "handleIncidents", label: "Handle Incidents" },
    { id: "manageFinances", label: "Manage Finances" },
  ];


  const togglePermission = (id) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((perm) => perm !== id)
        : [...prev.permissions, id],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASICURL}/auth/add-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("User added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        role: "",
        permissions: [],
      });
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Failed to add user";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="add-user">
      <h1>Add User</h1>
      <p>Create new user profile</p>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter User Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter User Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Enter User Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Enter User Age"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="moderator">Moderator</option>
          <option value="teamLead">Team Lead</option>
          <option value="securityGuard">Security Guard</option>
          <option value="fieldSupervisor">Field Supervisor</option>
          <option value="client">Client</option>
          <option value="itSpecialist">IT Specialist</option>
          <option value="hrManager">HR Manager</option>
          <option value="dispatcher">Dispatcher</option>
        </select>

        <div className="permissions-dropdown">
          <label>Permissions:</label>
          <div
            className="dropdown-header"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>
              {formData.permissions.length > 0
                ? formData.permissions
                  .map((permId) =>
                    allPermissions.find((perm) => perm.id === permId)?.label
                  )
                  .join(", ")
                : "Select Permissions"}
            </span>
            <span className="arrow">{showDropdown ? "▲" : "▼"}</span>
          </div>

          {showDropdown && (
            <div className="dropdown-menu">
              {allPermissions.map((perm) => (
                <label key={perm.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                  />
                  {perm.label}
                </label>
              ))}
            </div>
          )}
        </div>

        <button type="submit">Add User</button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default AddUser;