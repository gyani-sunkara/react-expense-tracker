import React, { useState, useContext } from "react";
import { Redirect, Link as RLink } from "react-router-dom";
import axios from "axios";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Snackbar } from "@material-ui/core";

import { GlobalContext } from "../context/GlobalState";

function Auth(props) {
  if (props.auth) {
    return <Redirect to="/dashboard" />;
  }
  return null;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" component={RLink} to="/">
        React Expense Tracker
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const { signedIn, signIn } = useContext(GlobalContext);
  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });

  function validate(creds) {
    if (creds.firstname !== undefined && creds.firstname !== "") {
      if (creds.lastname !== undefined && creds.lastname !== "") {
        if (creds.email !== undefined && creds.email !== "") {
          if (creds.password && creds.password !== "") {
            return true;
          } else {
            setSnack({ open: true, message: "Please enter a password" });
            return false;
          }
        } else {
          setSnack({ open: true, message: "Please enter your email address" });
          return false;
        }
      } else {
        setSnack({ open: true, message: "Please enter your last name" });
        return false;
      }
    } else {
      setSnack({ open: true, message: "Please enter your first name" });
      return false;
    }
  }

  function signup(creds) {
    axios({
      method: "post",
      url: "/api/users",
      data: creds,
    })
      .then((res) => {
        setState({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
        });
        signIn();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            setSnack({ open: true, message: err.response.data.msg });
          } else if (err.response.status === 500) {
            setSnack({
              open: true,
              message: "Can't seem to reach the server at the moment!",
            });
          } else {
            setSnack({ open: true, message: err.message });
          }
        } else {
          setSnack({ open: true, message: err.message });
        }
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const { firstname, lastname, email, password } = state;
    const creds = { firstname, lastname, email, password };
    if (validate(creds)) {
      signup(creds);
    }
  }

  return (
    <React.Fragment>
      <Auth auth={signedIn} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form onSubmit={onSubmit} className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={state.firstname}
                  onChange={(e) =>
                    setState({ ...state, firstname: e.target.value })
                  }
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={state.lastname}
                  onChange={(e) =>
                    setState({ ...state, lastname: e.target.value })
                  }
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={state.email}
                  onChange={(e) =>
                    setState({ ...state, email: e.target.value })
                  }
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={state.password}
                  onChange={(e) =>
                    setState({ ...state, password: e.target.value })
                  }
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link component={RLink} to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
          <Snackbar
            open={snack.open}
            message={snack.message}
            autoHideDuration={3000}
            onClose={(e, r) => {
              if (r === "clickaway") return;
              setSnack({ open: false, message: "" });
            }}
          />
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
}
