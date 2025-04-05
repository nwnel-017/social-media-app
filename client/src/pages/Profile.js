import React, { useEffect, useState, useContext } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/auth/follow-status/${id}`,
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );
        setIsFollowing(response.data.isFollowing); // Adjust based on your API response
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();

    axios.get(`http://localhost:3001/auth/basicInfo/${id}`).then((response) => {
      console.log("response from basic info get request: " + response.data);
      setUsername(response.data.username);
    });

    axios.get(`http://localhost:3001/posts/byUserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, [id]);

  const handleFollowUnfollow = async (req, res) => {
    if (loading) return; // Prevent multiple clicks while loading
    setLoading(true);
    console.log("attempting to make http request to follow user: " + id);
    try {
      const url = isFollowing
        ? `http://localhost:3001/auth/unfollow/${id}`
        : `http://localhost:3001/auth/follow/${id}`;

      console.log("attempting to call: " + url);
      // Make API request to follow/unfollow
      await axios
        .post(
          url,
          {},
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      // Toggle the follow/unfollow state
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error during follow/unfollow:", error);
    } finally {
      setLoading(false);
    }
  };

  //onclick follow added to test follow functionality
  //need to add id to params when calling follow function
  return (
    <div className="profilePageContainer" onClick={handleFollowUnfollow}>
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
        {authState.username !== username && (
          <button className="button-submit" id="follow-button">
            {isFollowing ? "Unfollow" : "Follow"}
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
