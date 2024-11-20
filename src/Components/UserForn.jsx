import React, { useState } from "react";
import { addUser, updateUser } from "../services/api";

const UserForm = ({ user, onClose, refreshUsers }) => {
  const [formData, setFormData] = useState(
    user || { name: "", email: "", department: "" }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        console.log("Updating user with ID:", user.id);
        await updateUser(user.id, formData);
        refreshUsers({ ...formData, id: user.id });
      } else {
        console.log("Adding user with data:", formData);
        const response = await addUser(formData);
        console.log("API Response:", response.data);
        const newUser = response?.data || { ...formData };
        if (!newUser.id) {
          newUser.id = Date.now(); // Generate unique ID if not returned by API
        }
        refreshUsers(newUser);
      }
      onClose();
    } catch (error) {
      console.error("Error during submit:", error);
      alert("Failed to save user");
    }
  };
  
  

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>{user ? "Edit User" : "Add User"}</h2>
        <label>
          Full Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Department:
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserForm;
