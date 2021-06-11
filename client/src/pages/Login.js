import React, { useState } from "react";
import { Avatar, Grid, TextField, Button, Snackbar } from "@material-ui/core";
import { getAccessToken } from "../utils/auth";
import "./Login.css";
import { Redirect } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";

export default function Login() {
  const [value, setValue] = useState(1);

  if (getAccessToken()) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login">
      <div className="login__body">
        <div className="sidebar">
          <Grid>
            <Grid align="center">
              {value === 1 ? (
                <LoginForm setValue={setValue} />
              ) : (
                <RegisterForm setValue={setValue} />
              )}
            </Grid>
          </Grid>
        </div>
        <div className="content"></div>
      </div>
    </div>
  );
}

function LoginForm(props) {
  const { setValue } = props;
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [alertContent, setAlertContent] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const register = (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      setType("error");
      setAlertContent("Ingrese Correo y Contraseña");
      setOpen(true);
    } else {
      axios
        .post("http://localhost:3001/sign-in", user)
        .then((response) => {
          const { accessToken, refreshToken } = response.data;
          localStorage.setItem(ACCESS_TOKEN, accessToken);
          localStorage.setItem(REFRESH_TOKEN, refreshToken);
          setType("success");
          setAlertContent("Login Correcto");
          setOpen(true);
          window.location.href = "/";
        })
        .catch((err) => {
          const { message } = err.response.data;
          setType("error");
          setAlertContent(message);
          setOpen(true);
        });
    }
  };
  return (
    <div className="login-form">
      <div className="header">
        <Avatar src="https://logodownload.org/wp-content/uploads/2015/04/whatsapp-logo-1.png" />
      </div>

      <h2>Iniciar Sesion</h2>
      <form className="form" onSubmit={register} onChange={onChange}>
        <TextField
          label="Ingrese Correo Electronico"
          name="email"
          value={user.email}
        />
        <TextField
          label="Ingrese Contraseña"
          type="password"
          name="password"
          value={user.password}
        />
        <Button variant="outlined" color="primary" type="submit">
          Ingresar
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} variant="filled">
          {alertContent}
        </Alert>
      </Snackbar>
      <div className="sign-up">
        <p>
          Si no tienes cuenta Registrate{" "}
          <span onClick={() => setValue(2)}>aqui</span>
        </p>
      </div>
    </div>
  );
}

function RegisterForm(props) {
  const { setValue } = props;
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [alertContent, setAlertContent] = useState("");

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const register = (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      setType("error");
      setAlertContent("Todos los campos son obligatorios");
      setOpen(true);
    } else {
      axios
        .post("http://localhost:3001/sign-up", user)
        .then((response) => {
          console.log(response);
          setType("success");
          setAlertContent("Usuario Creado Correctamente");
          setOpen(true);
          resetForm();
        })
        .catch((err) => console.log(err));
    }
  };

  const resetForm = () => {
    setUser({ name: "", email: "", password: "" });
  };

  return (
    <>
      <Avatar src="https://logodownload.org/wp-content/uploads/2015/04/whatsapp-logo-1.png" />
      <h2>Registrar Nuevo Usuario</h2>
      <form className="form" onSubmit={register} onChange={onChange}>
        <TextField label="Ingrese Nombre" name="name" value={user.name} />
        <TextField
          label="Ingrese Correo Electronico"
          name="email"
          value={user.email}
        />
        <TextField
          label="Ingrese Contraseña"
          type="password"
          name="password"
          value={user.password}
        />
        <Button variant="outlined" color="primary" type="submit">
          Crear Usuario
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} variant="filled">
          {alertContent}
        </Alert>
      </Snackbar>
      <div className="sign-up">
        <p>
          Si ya tienes cuenta inicia sesion{" "}
          <span onClick={() => setValue(1)}>aqui</span>
        </p>
      </div>
    </>
  );
}
