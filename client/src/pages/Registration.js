import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required("Username is required"),
    password: Yup.string().min(4).max(20).required("Password is required"),
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then(() => {
      console.log(data);
      navigate("/login");
    });
  };

  return (
    <div className="registration-page">
      <img src="/AppLogo.png" alt="App Logo" className="registration-logo" />
      <div className="registration-container">
        <h2>Create Account</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <Field
              type="text"
              name="username"
              placeholder="Username"
              className="input-field"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="error-message"
            />

            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="error-message"
            />

            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </Form>
        </Formik>
        <p className="link-text" onClick={() => navigate("/login")}>
          Already have an account? Sign In
        </p>
      </div>
    </div>
  );
}

export default Registration;
