import { LoadingButton } from "@mui/lab";
import { Box, Card, Checkbox, Grid, TextField, styled, useTheme } from "@mui/material";
import { encryptPassword } from "app/utils/PasswordEnc";
import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center"
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "center"
}));

const ContentBox = styled(JustifyBox)(() => ({
  height: "100%",
  padding: "32px",
  background: "rgba(0, 0, 0, 0.01)"
}));

const JWTRegister = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center"
  }
}));

// initial login credentials
const initialValues = {
  email: "",
  password: "",
  username: "",
  remember: true
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string().email("Invalid Email address").required("Email is required!")
});

export default function JwtRegister() {
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    const initialValues = {
      email: "",
      password: "",
      username: "",
      remember: true
    };
  };

  // const handleFormSubmit = (values) => {
  //   setLoading(true);

  //   try {
  //     register(values.email, values.username, values.password);
  //     navigate("/");
  //     setLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     setLoading(false);
  //   }
  // };

  const handleFormSubmit = async (values) => {
    // Prepare the user registration data

    const userData = {
      firstName: values.username,
      email: values.email,
      password: encryptPassword(values.password),
      userName: values.email
    };

    console.log("Test", userData);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/signup`,
        userData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.data.status) {
        // Handle authentication failure, display an error message, etc.
        toast.error(response.data.paramObjectsMap.errorMessage, {
          autoClose: 2000,
          theme: "colored"
        });
        console.log("Test1", userData);
      } else {
        // Successful registration, perform actions like storing tokens and redirecting
        localStorage.setItem("token", "YourAuthTokenHere"); // Replace with the actual token
        resetForm();
        // window.location.href = "/login";

        toast.success(response.data.paramObjectsMap.message, {
          autoClose: 2000,
          theme: "colored"
        });
        setTimeout(() => {
          navigate("/session/signin");
        }, 2000);
      }
    } catch (error) {
      localStorage.setItem("AccountCreated", false);
    }
  };

  return (
    <JWTRegister>
      <div>
        <ToastContainer />
      </div>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <img
                width="100%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
              />
            </ContentBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="username"
                      label="Username"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.username}
                      onChange={handleChange}
                      helperText={touched.username && errors.username}
                      error={Boolean(errors.username && touched.username)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 2 }}
                    />

                    <FlexBox gap={1} alignItems="center">
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        sx={{ padding: 0 }}
                      />

                      <Paragraph fontSize={13}>
                        I have read and agree to the terms of service.
                      </Paragraph>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Register
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
}
