//////////we should delete this page
import React, { useContext } from "react";
import axios from "axios";
import Profile from "./Profile";
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

function Feed({
  listOfPosts,
  likedPosts,
  createPost,
  validationSchema,
  likePost,
}) {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const initialValues = {
    title: "",
    postText: "",
    username: "",
  };

  return (
    <div className="homepage">
      <div className="side-panel flex-box flex-center flex-column">
        <div className="flex-half space-evenly">
          <div className="flex-box flex-center">
            <div
              className="user"
              onClick={() => {
                console.log(authState.username);
                navigate(`profile/${authState.username}`);
              }}
            >
              <AccountCircleIcon sx={{ color: grey[600], fontSize: 80 }} />
              <div className="flex-box flex-center row">
                {authState.username}
              </div>
            </div>
          </div>
          <div className="divider"></div>
        </div>
        <div className="flex-half space-evenly">
          <div className="profile-option">
            <div className="flex-box half">
              <PeopleOutlineIcon sx={{ color: grey[600] }} />
              <div className="pad center-vertical">Followers</div>
            </div>
          </div>
          <div className="profile-option">
            <div className="flex-box half">
              <PeopleOutlineIcon sx={{ color: grey[600] }} />
              <div className="pad center-vertical">Following</div>
            </div>
          </div>
          <div className="profile-option">
            <div
              className="flex-box half"
              onClick={() => {
                navigate(`profile/${authState.username}`);
              }}
            >
              <AccountCircleIcon sx={{ color: grey[600] }} />
              <div className="pad center-vertical">Profile</div>
            </div>
          </div>
          <div className="profile-option">
            <div className="flex-box half">
              <SettingsOutlinedIcon sx={{ color: grey[600] }} />
              <div className="pad center-vertical">Settings</div>
            </div>
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
        {listOfPosts?.map((value, key) => {
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

export default Feed;
