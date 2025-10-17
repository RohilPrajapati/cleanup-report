import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from '../api/call';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

// Validation schema
const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    login(values.username, values.password).then((res) => {
          console.log("inside then")
          const { access, refresh } = res.data.token;
          const {user} = res.data.user_detail

          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('auth', true);

          notification.success({
            message: "Login Successful",
            description: null,
            duration: 4,
            placement: 'topRight',
            style: { zIndex: 99999 }
          });
          navigate('/cleanup/report'); 
        }).catch((err) => {
          console.log("inside error")
          console.error(err);

          const detail = err.response?.data?.detail || 'Please check your input and try again.';
          console.log(detail)
          notification.error({
            message: detail,
            description: null,
            duration: 4,
            placement: 'topRight',
            style: { zIndex: 99999 }
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome</h2>
          <p className="login-subtitle">Please enter your credentials to continue</p>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" fill="currentColor"/>
                    <path d="M10 12C5.58172 12 2 14.6863 2 18H18C18 14.6863 14.4183 12 10 12Z" fill="currentColor"/>
                  </svg>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    className={`form-input ${errors.username && touched.username ? 'input-error' : ''}`}
                    placeholder="Enter your username"
                  />
                </div>
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 8H14V6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6V8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V10C17 8.89543 16.1046 8 15 8ZM8 6C8 4.89543 8.89543 4 10 4C11.1046 4 12 4.89543 12 6V8H8V6Z" fill="currentColor"/>
                  </svg>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`form-input ${errors.password && touched.password ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <span className="loading">
                    <span className="spinner"></span>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;