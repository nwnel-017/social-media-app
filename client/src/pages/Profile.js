import React, { useEffect, useState, useContext } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicInfo/${id}`).then((response) => {
      console.log("response from basic info get request: " + response.data);
      setUsername(response.data.username);
    });

    axios.get(`http://localhost:3001/posts/byUserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  const follow = (req, res) => {
    console.log("attempting to make http request to follow user");
    const id = req.params.id;
    axios.post(`http://localhost:3001/auth/follow/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    });
  };

  //onclick follow added to test follow functionality
  return (
    <div className="profilePageContainer" onClick={follow}>
      Follow
      <div className="basicInfo">
        <h1>Username: {username}</h1>
        {authState.username === username && (
          <button
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            Change Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div className="post">
              <div className="title">{value.title}</div>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                {value.userName}
                {""}
                {/* <ThumbUpAltIcon
                  onClick={() => likePost(value.id)}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn" //TO DO: create unlikeBttn and likeBttn class
                  }
                /> */}
                <label>{value.Likes.length} Likes</label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
