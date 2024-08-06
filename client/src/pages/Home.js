import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
    axios
      .get("http://localhost:3001/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(
          response.data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
      });
  }, []);

  const likePost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            //this can modify attributes of post without changing them all
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] }; //if post is the one we liked, we are keeping same post, but in likes array -> keeping array but adding one more element (0) to end
              } else {
                const likesArray = post.Likes;
                likesArray.pop(); //js method that removes the last item of an array
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div className="feed">
      {listOfPosts.map((value, key) => {
        return (
          <div className="post">
            <div className="post-body">
              <div className="user">
                <AccountCircleIcon />
                <div className="username">
                  <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                </div>
              </div>
              <div className="post-text-container">
                <div className="post-text">
                  <div className="title">{value.title}: </div>
                  <div
                    className="body"
                    onClick={() => {
                      navigate(`/post/${value.id}`);
                    }}
                  ></div>
                  {value.postText}
                </div>
              </div>
            </div>
            <div className="footer">
              <CommentIcon
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              />

              <ThumbUpAltIcon
                onClick={() => likePost(value.id)}
                className={
                  likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn" //TO DO: create unlikeBttn and likeBttn class
                }
              />
              <label> {value.Likes.length} </label>
              {/* <div className="username">
                <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
              </div> */}
              {/* <div className="comment-button">Comments</div> */}
              {/* <label> {value.Likes.length} </label> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
