import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();

    axios.get(`http://localhost:3001/auth/basicInfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`http://localhost:3001/posts/byUserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, [id]);

  const handleFollowUnfollow = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const url = isFollowing
        ? `http://localhost:3001/auth/unfollow/${id}`
        : `http://localhost:3001/auth/follow/${id}`;

      await axios.post(
        url,
        {},
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error during follow/unfollow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{username}</h1>
        {authState.username === username ? (
          <button
            className="profile-button"
            onClick={() => navigate("/changepassword")}
          >
            Change Password
          </button>
        ) : (
          <button className="profile-button" onClick={handleFollowUnfollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className="posts-grid">
        {listOfPosts.map((value, key) => (
          <div
            key={key}
            className="post-card"
            onClick={() => navigate(`/post/${value.id}`)}
          >
            <h3 className="post-title">{value.title}</h3>
            <p className="post-body">{value.postText}</p>
            <div className="post-footer">
              <span className="likes">
                <ThumbUpAltIcon style={{ fontSize: "16px" }} />
                {value.Likes.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
