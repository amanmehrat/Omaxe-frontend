//#region Modules

//#region 3rd party app
import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Paper,
  AppBar,
  Typography,
  Toolbar,
  Link,
} from "@material-ui/core";
import Joi from "@hapi/joi";

//#endregion

//#region Inbuilt
import { wireEventValue } from "../utils/func";
import { usePost } from "../utils/hooks";
import FormError from "../components/FormError";
import AuthContext from "../components/contexts/Auth";
//#endregion

//#endregion

const schema = Joi.object().keys({
  phoneNumberOrEmail: Joi.alternatives().try(
    Joi.string()
      .required()
      .error(() => "Please enter a valid email or phone number"),
    Joi.string()
      .email()
      .required()
      .error(() => "Please enter a valid email")
  ),
  password: Joi.string()
    .required()
    .error(() => "Please enter you password."),
});

const Login = () => {
  const { token, setAuthValue, redirectToPrivateRoute } = useContext(AuthContext);
  const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [frontendError, setFrontendError] = useState(null);

  const {
    // isLoading: loginLoading,
    run: loginUser,
    error: loginError,
    // setError: setLoginError,
  } = usePost(
    "/auth/login",
    { phoneNumberOrEmail, password },
    {
      onResolve: ({ token, user }) => {
        // setToken(token);
        // setUser(user);
        setAuthValue(token, user);
      },
    }
  );

  if (token) {
    return redirectToPrivateRoute();
  }

  return (
    <div>
      <AppBar position="static" alignitems="center" color="primary">
        <Toolbar>
          <Grid container justify="center" wrap="wrap">
            <Grid item>
              <Typography variant="h6">Omaxe</Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container spacing={0} justify="center" direction="row">
        <Grid item>
          <Grid
            container
            direction="column"
            justify="center"
            spacing={2}
            className="login-form"
          >
            <Paper
              variant="elevation"
              elevation={2}
              className="login-background"
            >
              <Grid item>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
              </Grid>
              <Grid item>
                <form>
                  <FormError
                    backendError={loginError}
                    frontendError={frontendError}
                  />
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextField
                        type="email"
                        placeholder="Email or Phone Number"
                        fullWidth
                        name="phoneNumberOrEmail"
                        variant="outlined"
                        required
                        onChange={wireEventValue(setPhoneNumberOrEmail)}
                        autoFocus
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        type="password"
                        placeholder="Password"
                        fullWidth
                        name="password"
                        variant="outlined"
                        onChange={wireEventValue(setPassword)}
                        required
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          let validation = schema.validate({
                            phoneNumberOrEmail,
                            password,
                          });
                          if (validation.error) {
                            setFrontendError(validation.error);
                          } else loginUser();
                        }}
                        className="button-block"
                      >
                        LOGIN
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <Grid item>
                <Link href="/forgot-password" variant="body2">
                  Forgot Password?
                </Link>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
