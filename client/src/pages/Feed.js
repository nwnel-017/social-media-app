import React, { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
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

import "../App.css";
import { AuthContext } from "../helpers/AuthContext";

function Feed({ listOfPosts, likedPosts }) {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const initialValues = {
    postText: "",
  };

  const createPost = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => window.location.reload());
  };

  const likePost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then(() => window.location.reload());
  };

  const validationSchema = Yup.object().shape({
    postText: Yup.string().max(500).required("Post cannot be empty"),
  });

  return (
    <div className="feed-container">
      <aside className="sidebar">
        <div
          className="profile-card"
          onClick={() => navigate(`/profile/${authState.id}`)}
        >
          <AccountCircleIcon className="icon-large" />
          <div className="username">{authState.username}</div>
        </div>
        <div className="sidebar-options">
          <div className="option">
            <PeopleOutlineIcon /> Followers
          </div>
          <div className="option">
            <PeopleOutlineIcon /> Following
          </div>
          <div
            className="option"
            onClick={() => navigate(`/profile/${authState.id}`)}
          >
            <AccountCircleIcon /> Profile
          </div>
          <div className="option" onClick={() => navigate("/settings")}>
            <SettingsOutlinedIcon /> Settings
          </div>
        </div>
      </aside>

      <main className="feed">
        <div className="create-post">
          <AccountCircleIcon className="icon-medium" />
          <Formik
            initialValues={initialValues}
            onSubmit={createPost}
            validationSchema={validationSchema}
          >
            <Form className="post-form">
              <ErrorMessage name="postText" component="div" className="error" />
              <Field
                name="postText"
                placeholder="What's on your mind?"
                className="post-input"
              />
              <div className="post-actions">
                <ImageOutlinedIcon />
                <GifBoxOutlinedIcon />
                <EmojiEmotionsOutlinedIcon />
                <LocationOnOutlinedIcon />
                <button type="submit" className="post-button">
                  Post
                </button>
              </div>
            </Form>
          </Formik>
        </div>

        {listOfPosts.map((post) => (
          <div key={post.id} className="post">
            <div
              className="post-header"
              onClick={() => navigate(`/profile/${post.UserId}`)}
            >
              <AccountCircleIcon className="icon-small" />
              <span className="post-username">{post.username}</span>
            </div>
            <div
              className="post-body"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {post.postText}
            </div>
            <div className="flex-middle">
              <div className="post-footer">
                <CommentOutlinedIcon
                  onClick={() => navigate(`/post/${post.id}`)}
                />
                <div className="like-section">
                  <ThumbUpOutlinedIcon
                    onClick={() => likePost(post.id)}
                    className={likedPosts.includes(post.id) ? "liked" : ""}
                  />
                  <span>{post.Likes.length}</span>
                </div>
                <RepeatOutlinedIcon />
                <FileUploadOutlinedIcon />
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Feed;
