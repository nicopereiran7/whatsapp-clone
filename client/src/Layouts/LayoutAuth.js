import React from "react";
import { Redirect, Route } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Login from "../pages/Login";
import useAuth from "../hooks/useAuth";

import "./LayoutAuth.css";

export default function LayoutAuth(props) {
  const { routes } = props;
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
      <div className="layout-auth">
        <div className="layout-auth__body">
          <Sidebar user={user} />
          <LoadRoutes routes={routes} />
        </div>
      </div>
    );
  }

  return null;
}

function LoadRoutes(props) {
  const { routes } = props;
  return routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      exact={route.exact}
      component={route.component}
    />
  ));
}
