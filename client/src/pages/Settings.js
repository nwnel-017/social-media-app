import React, { useState } from "react";
import axios from "axios";

function Settings() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving settings:", user);
    // Add axios PUT/POST request here to update user settings
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Account Settings</h2>
        <form className="settings-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="Enter username"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
          />

          <label>Profile Picture</label>
          <input
            type="text"
            name="profilePicture"
            value={user.profilePicture}
            onChange={handleChange}
            placeholder="Image URL"
          />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
