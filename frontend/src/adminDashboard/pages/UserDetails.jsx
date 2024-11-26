import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDetails.scss";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASICURL}/auth/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data.user);
        console.log(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone || "",
          status: response.data.user.status,
          role: response.data.user.role,
          permissions: response.data.user.permissions || [],
        });
      } catch (err) {
        setError(err.response?.data?.msg || "Error fetching user details");
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const permissions = checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((perm) => perm !== value);
      return { ...prev, permissions };
    });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASICURL}/auth/deleteuser/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/users");
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASICURL}/auth/edituser/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  return (
    <div className="user-details">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <div>
          <h1>User Details</h1>
          <label>
            <strong>Name:</strong>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </label>

          <label>
            <strong>Email:</strong>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </label>

          <label>
            <strong>Phone:</strong>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </label>

          <label>
            <strong>Status:</strong>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label>
            <strong>Role:</strong>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
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
          </label>

          <label>
            <strong>Permissions:</strong>
            <div className="permissions-dropdown">
              <button
                className="permissions-dropdown-toggle"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {formData.permissions.length > 0
                  ? formData.permissions
                    .map((perm) => allPermissions.find((p) => p.id === perm)?.label || perm)
                    .join(", ")
                  : "Select Permissions"}
              </button>
              {showDropdown && (
                <div className="permissions-dropdown-menu">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="permission-option">
                      <input
                        type="checkbox"
                        id={permission.id}
                        name="permissions"
                        value={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onChange={handlePermissionChange}
                        disabled={!isEditing}
                      />
                      <label htmlFor={permission.id}>{permission.label}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>


          <div className="btns">
            <button className="btn" onClick={handleEditToggle} disabled={isEditing}>
              Edit
            </button>
            {isEditing && (
              <button className="btn" onClick={handleSaveChanges}>Save Changes</button>
            )}
            <button className="btn" onClick={handleDelete}>Delete</button>
          </div>

          <button className="btn" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default UserDetails;