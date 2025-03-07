import React, { useState, useEffect } from "react";
import axios from "axios";

function Settings() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
  });

  const handleSubmit = (async) => {
    console.log("do something");
  };
  return (
    <div className="account-settings">
      <h1>Account Settings</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            // value={user.username}
            // onChange={handleChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            // value={user.email}
            // onChange={handleChange}
          />
        </div>
        <div>
          <label>Bio</label>
          {/* <textarea name="bio" value={user.bio} onChange={handleChange} /> */}
        </div>
        <div>
          <label>Profile Picture</label>
          <input
            type="text"
            name="profilePicture"
            // value={user.profilePicture}
            // onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Settings;
