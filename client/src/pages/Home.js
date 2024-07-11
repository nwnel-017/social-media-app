import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/Posts").then((response) => {
      setListOfPosts(response.data);
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
      });
  };

  return (
    <div>
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
              {value.userName}{" "}
              <ThumbUpAltIcon onClick={() => likePost(value.id)} />
              <label> {value.Likes.length} </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
