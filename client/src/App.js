import "./App.css";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  // Navigate,
  // useNavigate,
} from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import ChangePassword from "./pages/ChangePassword";

function App() {
  // const navigate = useNavigate(); //error with this -> we need to move Router higher up in react tree
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({
            username: "",
            id: 0,
            status: false,
          });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
    setAuthState(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState(false);
    // navigate("/login");
  };

  return (
    <div>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div>
            {!authState ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Create Account</Link>
              </>
            ) : (
              <>
                <div className="banner">
                  <Link to="/">Home Page</Link>
                  {/* <Link to="/createpost">Create a Post</Link> */}
                  <button onClick={logout}>Logout</button>
                </div>
                {/* <div className="feed"> */}
                <div className="createPost">
                  {/* <div className="profilepic"></div> */}
                  {/* <Link to="/createpost">Create a Post</Link> */}
                </div>
                {/* </div> */}
              </>
            )}
          </div>
          <Routes>
            <Route path="/" exact Component={Home} />
            {/* <Route path="/createpost" exact Component={CreatePost} /> */}
            <Route path="/post/:id" exact Component={Post} />
            <Route path="/login" exact Component={Login} />
            <Route path="/registration" exact Component={Registration} />
            <Route path="/profile/:id" exact Component={Profile}></Route>
            <Route path="/changepassword" exact Component={ChangePassword} />
            <Route path="*" exact Component={PageNotFound} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

<style>
  @import
  url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
</style>;
