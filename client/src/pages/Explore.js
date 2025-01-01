import React, { useContext } from "react";
import axios from "axios";
import Profile from "./Profile";
import Feed from "./Feed";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Explore() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    //here we need to write the code to either retreive posts of users we follow, or all posts
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
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
      console.log(listOfPosts);
    }
  }, []);

  const initialValues = {
    title: "",
    postText: "",
    username: "",
  };

  return <Feed listOfPosts={listOfPosts} likedPosts={likedPosts} />;
}

export default Explore;
