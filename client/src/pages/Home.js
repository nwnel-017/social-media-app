import React, { useContext } from "react";
import axios from "axios";
import Feed from "./Feed";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();

  //conditional useEffect hook
  useEffect(() => {
    //if we have an access token - then retreive posts of users we follow
    if (!localStorage.getItem("accessToken")) {
      console.log("no access token found from home");
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts/following", {
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

export default Home;
