import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

const AuthContext = React.createContext();

const redirectToPublicRoute = () => <Redirect to="/login" />;
const redirectToPrivateRoute = () => <Redirect to="/" />;

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    redirectToPublicRoute();
  };

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const setAuthValue = (token ,user)=>{
    setUser(user);
    setToken(token);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        redirectToPublicRoute,
        redirectToPrivateRoute,
        setAuthValue,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;