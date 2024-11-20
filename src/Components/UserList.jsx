import React, { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../services/api";
import UserForm from "./UserForn";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [nextId, setNextId] = useState(1); // Initialize the next ID counter
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
        const maxId = Math.max(...response.data.map((user) => user.id), 0);
        setNextId(maxId + 1);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch {
      setError("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setShowForm(true);
  };
  useEffect(() => {
    console.log("Users state updated:", users);
  }, [users]);

  const refreshUsers = (updatedUser) => {
    console.log("Updated user received:", updatedUser);
    if (updatedUser.id) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } else {
      updatedUser.id = nextId; // Assign the next sequential ID
      setUsers((prevUsers) => [...prevUsers, updatedUser]);
      setNextId((prevId) => prevId + 1); // Increment the ID counter
    }
  };
  

  return (
    <div className="user-list">
      <h1>User Management</h1>
      {error && <p className="error">{error}</p>}
      <button className="add-button" onClick={handleAdd}>
        Add User
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name.split(" ")[0]}</td>
              <td>{user.name.split(" ")[1] || ""}</td>
              <td>{user.email}</td>
              <td>{user.department || "N/A"}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <UserForm
          user={selectedUser}
          onClose={() => setShowForm(false)}
          refreshUsers={refreshUsers}
        />
      )}
    </div>
  );
};

export default UserList;