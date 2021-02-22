import React, { useContext } from 'react'
import { Link, NavLink } from "react-router-dom";
import AuthContext from "./contexts/Auth";

import { Avatar, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import './Navbar.css'

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="navbar">
            <div className="navbar__header">
                <div className="navbar__headerLeft">
                    <Link to="/" className="navbar--heading">Omaxe Facility Manager</Link>
                </div>
                <div className="navbar__headerRight">
                    <ul className="rightnavlist">
                        <li>
                            <a className="topnav">
                                <IconButton>
                                    <Avatar className="userprofile navbar__headerRight--Icon" src="https://pbs.twimg.com/profile_images/964867480580636672/7BCvJq4g_400x400.jpg" />
                                </IconButton>
                            </a>
                            <div className="hovermenu">
                                <NavLink to="/projects" className="hmenulink">{user.name}({user.role})</NavLink>
                                <NavLink to="/logout" className="hmenulink" onClick={logout}> Logout</NavLink>
                            </div>
                        </li>
                    </ul>
                    {/* <IconButton>
                        <MoreVertIcon className="navbar__headerRight--Icon" />
                    </IconButton> */}
                </div>
            </div>
        </div>
    )
}

export default Navbar;
