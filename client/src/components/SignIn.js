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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const { signedIn, signIn } = useContext(GlobalContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });

  function validate(creds) {
    if (creds.email !== undefined && creds.email !== "") {
      if (creds.password && creds.password !== "") {
        return true;
      } else {
        setSnack({ open: true, message: "Please enter your password" });
        return false;
      }
    } else {
      setSnack({ open: true, message: "Please enter your email address" });
      return false;
    }
  }

  function signin(creds) {
    axios({
      method: "post",
      url: "/api/auth",
      data: creds,
    })
      .then((res) => {
        setEmail("");
        setPassword("");
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
    const creds = { email, password };
    if (validate(creds)) {
      signin(creds);
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
            Sign in
          </Typography>
          <form onSubmit={onSubmit} className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RLink} to="/" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
}
