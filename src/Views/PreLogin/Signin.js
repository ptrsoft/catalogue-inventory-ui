import React, { Component } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  Link,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import GoogleIcon from "@mui/icons-material/Google";
import { ValidationEngine} from "Utils/helperFunctions"; // Import your validation engine and error messages

const styles = (theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundImage: "url(/path-to-your-background-image.png)", // Ensure your image is in the public folder or use the correct path
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  box: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  input: {
    margin: "10px 0",
  },
  button: {
    margin: "20px 0",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px 0",
    textTransform: "none",
  },
});
const validationSchema = {
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

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: false,
      isSumitted: false,
      errors: {}, // State to hold validation errors
    };
  }

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === "checkbox" ? checked : value;
    this.setState({ [name]: val });
  };

  validateForm = () => {
    const { email, password } = this.state;
    const error = ValidationEngine.validate(validationSchema, {
      email,
      password,
    });
    return error;
  };

  handleSignIn = () => {
    const errorData = this.validateForm();
    this.setState({
      isSumitted: true,
    });
    if (errorData.isValid) {
    }
  };

  render() {
    const errorData = this.validateForm();
    const { classes } = this.props;
    const { email, password, rememberMe, isSumitted } = this.state;
    return (
      <Container className={classes.container}>
        <Box className={classes.box}>
          <Typography variant="h5" gutterBottom>
            Sign in to Rasi Lab
          </Typography>
          <TextField
            className={classes.input}
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={email}
            onChange={this.handleChange}
            error={!errorData.email.isValid && isSumitted}
            helperText={isSumitted ? errorData.email.message : ""}
          />
          <TextField
            className={classes.input}
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            name="password"
            value={password}
            onChange={this.handleChange}
            error={!errorData.password.isValid && isSumitted}
            helperText={isSumitted ? errorData.password.message : ""}
          />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Checkbox
                checked={rememberMe}
                onChange={(event) =>
                  this.setState({ rememberMe: event.target.checked })
                }
              />
              <Typography variant="body2">Remember me</Typography>
            </Box>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Box>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            fullWidth
            onClick={this.handleSignIn}
          >
            Sign In
          </Button>
          <Typography variant="body2" gutterBottom>
            Or
          </Typography>
          <Button
            className={`${classes.button} ${classes.googleButton}`}
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
          <Typography variant="body2">
            Don't have an account? <Link href="#">Sign up Now</Link>
          </Typography>
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles)(Signin);
