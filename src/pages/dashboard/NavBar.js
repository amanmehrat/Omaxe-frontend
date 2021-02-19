import React from "react";
import { useHistory } from "react-router";
import "./navBar.scss";

const NavBar = () => {
  const history = useHistory();
  return (
    <div className="navBar">
      <div className="navBar__logo" onClick={() => history.push("/")}>
          <h2>Omaxe Facility Manager</h2>
      </div>
      <div className="navBar__content">
      </div>
    </div>
  );
};

export default NavBar;
