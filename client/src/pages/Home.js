import React, { useContext } from "react";
import axios from "axios";
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
import { AuthContext } from "../helpers/AuthContext";
import { blue, blueGrey, grey } from "@mui/material/colors";

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

  const initialValues = {
    title: "",
    postText: "",
    username: "",
  };

  const validationSchema = Yup.object().shape({
    // title: Yup.string().required(),
    postText: Yup.string().required(),
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
        setListOfPosts(response.data.listOfPosts);
        console.log(response.data);
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
    <div className="homepage">
      <div className="side-panel flex-box flex-center light-background">
        <div className="flex-top-half flex-center">
          <div
            className="user"
            onClick={() => {
              navigate(`profile/${authState.username}`);
            }}
          >
            <AccountCircleIcon sx={{ color: grey[600], fontSize: 80 }} />
            <div className="username">{authState.username}</div>
          </div>
        </div>
      </div>
      <div className="feed light-background">
        <div className="createPost">
          <div className="user">
            <AccountCircleIcon sx={{ color: grey[600], fontSize: 80 }} />
            {/* <AccountCircleIcon sx={{ color: "white", fontSize: 80 }} /> */}
          </div>
          <Formik
            initialValues={initialValues}
            onSubmit={createPost}
            validationSchema={validationSchema}
          >
            <Form className="center-vertical">
              <div className="form-container">
                <ErrorMessage name="postText" component="span" />
                <Field
                  id="inputCreatePost"
                  name="postText"
                  placeHolder="What's going on"
                ></Field>
                <div>
                  <div className="space-between margin-top">
                    <ImageOutlinedIcon />
                    <GifBoxOutlinedIcon />
                    <EmojiEmotionsOutlinedIcon />
                    <LocationOnOutlinedIcon />
                    <button type="submit" id="submit-new-post">
                      Create Post
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
        {listOfPosts.map((value, key) => {
          return (
            <div className="post">
              <div className="post-body">
                <div
                  className="user"
                  onClick={() => {
                    navigate(`profile/${value.UserId}`);
                  }}
                >
                  <AccountCircleIcon sx={{ color: grey[600], fontSize: 40 }} />
                  {/* <AccountCircleIcon sx={{ color: "white", fontSize: 40 }} /> */}

                  <div className="username">
                    {/* <Link to={`/profile/${value.UserId}`}>{value.username}</Link> */}
                    {value.username}
                  </div>
                </div>
                {/* <div className="post-body"> */}
                <div className="post-text-container center-vertical">
                  {/* <div className="post-text"> */}
                  {/* <div className="title">{value.title}: </div> */}
                  <div
                    className="body"
                    onClick={() => {
                      navigate(`/post/${value.id}`);
                    }}
                  ></div>
                  {value.postText}
                </div>
                {/* </div> */}
              </div>
              <div className="footer">
                <CommentOutlinedIcon
                  sx={{ color: grey[600] }}
                  // sx={{ color: "white" }}
                  onClick={() => {
                    navigate(`/post/${value.id}`);
                  }}
                />
                <div className="likes">
                  <ThumbUpOutlinedIcon
                    sx={{ color: grey[600] }}
                    // sx={{ color: "white" }}
                    onClick={() => likePost(value.id)}
                    className={
                      likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn" //TO DO: create unlikeBttn and likeBttn class
                    }
                  />
                  <label> {value.Likes.length} </label>
                </div>
                <RepeatOutlinedIcon sx={{ color: grey[600] }} />
                {/* <RepeatOutlinedIcon sx={{ color: "white" }} /> */}
                <FileUploadOutlinedIcon sx={{ color: grey[600] }} />
                {/* <FileUploadOutlinedIcon sx={{ color: "white" }} /> */}
                {/* <FileUploadOutlinedIcon sx={{ color: "white" }} /> */}
                {/* <div className="username">
                <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
              </div> */}
                {/* <div className="comment-button">Comments</div> */}
                {/* <label> {value.Likes.length} </label> */}
              </div>
              {/* </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
