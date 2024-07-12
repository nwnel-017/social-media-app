import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
    username: "",
  };

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    }
  }, []); //without [] -> useEffect will run infinitely

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
    username: Yup.string().min(3).max(15).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/posts", data).then((response) => {
      console.log("successful");
    });
  };
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="inputCreatePost"
            name="title"
            placeHolder="(Ex. Title...)"
          ></Field>
          <label>Post Text: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputCreatePost"
            name="postText"
            placeHolder="(Ex. Post...)"
          ></Field>
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputCreatePost"
            name="username"
            placeHolder="(Ex. john123...)"
          ></Field>
          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
