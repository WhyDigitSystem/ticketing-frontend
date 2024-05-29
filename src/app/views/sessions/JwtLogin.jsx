import { LoadingButton } from "@mui/lab";
import { Box, Card, Checkbox, Grid, TextField, styled, useTheme } from "@mui/material";
import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { encryptPassword } from "app/utils/PasswordEnc";
import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex"
}));

const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)"
}));

const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // backgroundColor: "#1A2038",
  background: "linear-gradient(to right, #3498db, #2ecc71)",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center"
  },

  ".img-wrapper": {
    height: "100%",
    minWidth: 320,
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center"
  }
}));

// initial login credentials
const initialValues = {
  email: "",
  password: "",
  remember: true
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!")
  // email: Yup.string().email("Invalid Email address").required("Email is required!")
});

export default function JwtLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  // const handleFormSubmit = async (values) => {
  //   setLoading(true);
  //   try {
  //     await login(values.email, values.password);
  //     navigate("/");
  //   } catch (e) {
  //     setLoading(false);
  //   }
  // };

  // const resetForm = () => {
  //   const initialValues = {
  //     email: "",
  //     password: ""
  //   };
  // };

  useEffect(() => {
    const isLoggedOut = localStorage.getItem("logout");
    if (isLoggedOut) {
      localStorage.removeItem("logout");
      window.location.reload();
    }
  }, []);

  const handleFormSubmit = async (values) => {
    // Prepare the user registration data

    console.log("Checked", values);

    const userData = {
      password: encryptPassword(values.password),
      userName: values.email
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/login`,
        userData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.status) {
        // Handle authentication failure, display an error message, etc.
        localStorage.setItem("userType", response.data.paramObjectsMap.userVO.type);
        localStorage.setItem("userName", response.data.paramObjectsMap.userVO.firstName);

        navigate("/dashboard/default");
      } else {
        // Successful registration, perform actions like storing tokens and redirecting

        toast.error(response.data.paramObjectsMap.errorMessage, {
          autoClose: 2000,
          theme: "colored"
        });
      }
    } catch (error) {
      localStorage.setItem("AccountCreated", false);
    }
  };

  return (
    <StyledRoot>
      <div>
        <ToastContainer />
      </div>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <div className="img-wrapper">
              {/* <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" /> */}
            </div>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <Formik
                onSubmit={(values) => handleFormSubmit(values)}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      // type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      // helperText={touched.email && errors.email}
                      // error={Boolean(errors.email && touched.email)}
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
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>

                    <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Register
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}
