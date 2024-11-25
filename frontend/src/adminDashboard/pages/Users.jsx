import React, { useEffect, useState } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css";
import "./Users.scss";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  
  const [usersPerPage] = useState(10); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASICURL}/auth/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (err) {
        setError(err.response?.data?.msg || "Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); 
  };

  const confirmDelete = (userId) => {
    setDeleteUserId(userId);
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BASICURL}/auth/deleteuser/${deleteUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("User deleted successfully!", { autoClose: 3000 });
      setUsers((prev) => prev.filter((user) => user.id !== deleteUserId));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== deleteUserId));
      setDeleteUserId(null);
    } catch (error) {
      toast.error("Failed to delete user", { autoClose: 3000 });
      setDeleteUserId(null);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="users">
      <h1>Users</h1>
      <input
        type="text"
        placeholder="Search by name, email, phone, role, or status "
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {filteredUsers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>SNO</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1 + (currentPage - 1) * usersPerPage}</td>
                <td className="namelink">
                  <Link to={`/users/${user.id}`} className="user-link">
                    {user.name}
                  </Link>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || "N/A"}</td>
                <td>{user.status}</td>
                <td>{user.role}</td>
                <td className="icon-delete">
                  <button
                    onClick={() => confirmDelete(user.id)}
                    className="action-btn delete"
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <Popup open={!!deleteUserId} closeOnDocumentClick onClose={() => setDeleteUserId(null)}>
        <div className="popup-modal">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this user?</p>
          <div className="popup-actions">
            <button onClick={handleDelete} className="confirm-btn">
              Delete
            </button>
            <button onClick={() => setDeleteUserId(null)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </Popup>
      <ToastContainer />
    </div>
  );
};

export default Users;
