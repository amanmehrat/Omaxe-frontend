import React, { useContext } from "react";
import "./sidenav.scss";
import { NavLink } from "react-router-dom";
import AuthContext from "../../components/contexts/Auth";

const SideNav = (props) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <div className="sideNav">
        <NavLink
          to="/projects"
          // activeClassName={"sideNav__head--active"}
          className={"sideNav__textDecoration"}
        >
          <div className="sideNav__head  ">
            <div className="sideNav__head--name">
              <p className="sideNav__head--name--text">{user.name}</p>
              <p className="sideNav__head--name--org">{user.role}</p>
            </div>
          </div>
        </NavLink>

        <NavLink
          to="/projects"
          className={"sideNav__textDecoration"}
          activeClassName={"sideNav__link--active"}
        >
          <div className="sideNav__link">
            <p className="sideNav__link--text">Project</p>
          </div>
        </NavLink>

        {/* <NavLink
          to="/flat"
          className={"sideNav__textDecoration"}
          activeClassName={"sideNav__link--active"}
        >
          <div className="sideNav__link">
            <p className="sideNav__link--text">Flat</p>
          </div>
        </NavLink> */}

        {
          user && user.role == "admin" && (<NavLink
            to="/teams"
            className={"sideNav__textDecoration"}
            activeClassName={"sideNav__link--active"}
          >
            <div className="sideNav__link">
              <p className="sideNav__link--text">Team</p>
            </div>
          </NavLink>)
        }

        <NavLink
          to="/logout"
          className={"sideNav__textDecoration"}
          activeClassName={"sideNav__link--active"}
        >
          <div className="sideNav__link">
            <p className="sideNav__link--text" onClick={logout}>Log Out</p>
          </div>
        </NavLink>
      </div>
    </>
  );
};
export default SideNav;
