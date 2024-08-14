import React, { Component } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ValidationEngine} from "Utils/helperFunctions";
const validationSchema = {
  f_name: [
    {
      message: "Please enter Name",
      type: ValidationEngine.type.MANDATORY,
    },
  ],
  l_name: [
    {
      message: "Please enter Name",
      type: ValidationEngine.type.MANDATORY,
    },
  ],
  email: [
    {
      message: "Please enter Email",
      type: ValidationEngine.type.MANDATORY,
    },
    {
      message: "Please valid Email",
      type: ValidationEngine.type.REGEX,
      regex: ValidationEngine.EMAIL_REGEX,
    },
  ],
  password: [
    {
      message: "Please enter Password",
      type: ValidationEngine.type.MANDATORY,
    },
  ],
};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      f_name: "",
      l_name: "",
      email: "",
      password: "",

      isSubmitted: false,
    };
  }

  handleClickShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  handleSignup = () => {
    const errorData = this.validateForm();
    this.setState({
      isSubmitted: true,
    });

    if (errorData.isValid) {
      // api call
      // this.props.Signup({})
    }
  };

  validateForm = () => {
    const { f_name, l_name, email, password } = this.state;
    const error = ValidationEngine.validate(validationSchema, {
      f_name: f_name,
      l_name: l_name,
      email: email,
      password: password,
    });

    return error;
  };
  handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === "checkbox" ? checked : value;
    this.setState({ [name]: val });
  };

  render() {
    const errorData = this.validateForm();

    const { showPassword, f_name, l_name, email, password, isSubmitted } =
      this.state;

    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up to <span style={{ color: "#9C27B0" }}>Rasi Lab</span>
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="f_name"
                  required
                  fullWidth
                  id="f_name"
                  label="First Name"
                  value={f_name}
                  error={!errorData.f_name.isValid && isSubmitted}
                  helperText={isSubmitted ? errorData.f_name.message : ""}
                  onChange={this.handleChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="l_name"
                  label="Last Name"
                  value={l_name}
                  error={!errorData.l_name.isValid && isSubmitted}
                  helperText={isSubmitted ? errorData.l_name.message : ""}
                  onChange={this.handleChange}
                  name="l_name"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                {/* <TextField
                  required
                  fullWidth
                  id="email"
                  value={email}
                  label="Email Address"
                  name="email"
                  error={!errorData.email.isValid && isSumitted}
                  helperText={isSumitted ? errorData.email.message : ""}
                  onChange={this.handleChange}
                  autoComplete="email"
                /> */}
                <TextField
               
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  error={!errorData.email.isValid && isSubmitted}
                  helperText={isSubmitted ? errorData.email.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!errorData.password.isValid && isSubmitted}
                  helperText={isSubmitted ? errorData.password.message : ""}
                  value={password}
                  onChange={this.handleChange}
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I have read and agree to the Terms of Service"
                />
              </Grid>
            </Grid>
            <Button
              onClick={this.handleSignup}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#9C27B0" }}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  alt="Google"
                />
              }
              sx={{ mb: 2, backgroundColor: "#4285F4", color: "#fff" }}
            >
              Sign up with Google
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign In Now
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Signup;
