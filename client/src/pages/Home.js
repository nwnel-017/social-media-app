import React, { useContext } from "react";
import axios from "axios";
import Profile from "./Profile";
import Feed from "./Feed";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { AuthContext } from "../helpers/AuthContext";
import { blue, blueGrey, grey } from "@mui/material/colors";
import { create } from "@mui/material/styles/createTransitions";

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

  const validationSchema = Yup.object().shape({
    postText: Yup.string().max(500).required(),
    // username: Yup.string().min(3).max(15).required(),
  });

  const createPost = (data) => {
    console.log("creating post " + data);
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        // navigate("/");
        console.log("setting list of posts after post request");
        console.log(response.data);
        window.location.reload(false);
      });
  };

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
    <Feed
      listOfPosts={listOfPosts}
      likedPosts={likedPosts}
      createPost={createPost}
      validationSchema={validationSchema}
      likePost={likePost}
    />
  );
}

export default Home;
