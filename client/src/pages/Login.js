import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      console.log(
        "response data being saved in session storage: " + response.data
      );
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }
    });
  };

  return (
    <div className="login">
      <div className="rectangle-1"></div>
      <div className="right-side">
        <div className="stack">
          <h1 className="heading roboto-bold">Sign In</h1>
          <input
            className="login-input indent"
            type="text"
            placeholder="@ U s e r n a m e"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            className="login-input indent roboto"
            type="password"
            placeholder="@ P a s s w o r d"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <div className="small-text indent roboto-light">
            <input type="checkbox" class="small-checkbox"></input>
            Remember Me
          </div>
          <button onClick={login} className="button-submit indent">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
