import React from "react";
import Login from "../pages/Login";
import SideBar from "../components/SideBar";
import useAuth from "../hooks/useAuth";
import routes from "../routes/Routes";
import { Route, Redirect } from "react-router-dom";

import "./Auth.css";

export default function Auth() {
  const { user, isLoading } = useAuth();

  if (!user && !isLoading) {
    return (
      <>
        <Route path="/sign-in" component={Login} />
        <Redirect to="/sign-in" />
      </>
    );
  }

  if (user && !isLoading) {
    return (
      <div className="auth">
        <div className="auth__body">
          <SideBar user={user} />
          <div className="auth__content">
            <LoadRoutes routes={routes} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function LoadRoutes({ routes }) {
  return routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      exact={route.exact}
      component={route.component}
    />
  ));
}
