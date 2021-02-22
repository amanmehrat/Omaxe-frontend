import React, { useState, useEffect, useContext } from 'react'
import { useHistory, Link } from 'react-router-dom';
import AuthContext from "./contexts/Auth";


import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

import './Sidebar.css'

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);

    console.log("user", user);
    let history = useHistory();

    return (
        <div className="sidebar">
            {/* <div className="sidebar__header">
                <Avatar src="https://pbs.twimg.com/profile_images/964867480580636672/7BCvJq4g_400x400.jpg" />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchIcon />
                    <input
                        type="text"
                        value={value}
                        //                 onChange={searchRoom}
                        placeholder="Search or start new chat"
                    />
                    <AddIcon
                        //               onClick={addRoom}
                        ref={addButton}
                        style={{ display: "none" }}
                    />
                </div>
            </div>
            */}
            <div className="sidebar__chats">
                <Link to="/projects" className="sidebarChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <AssessmentIcon />
                    <div className="sidebarChat_info">
                        <h2>Projects</h2>
                    </div>
                </Link>
                <Link to="/" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <div className="sidebarChat_info">
                        <SubdirectoryArrowRightIcon />
                        <p>Project Name</p>
                    </div>
                </Link>
                {
                    user && user.role == "admin" && <Link to="/users" className="sidebarChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                        <PeopleOutlineIcon />
                        <div className="sidebarChat_info">
                            <h2>Users</h2>
                        </div>
                    </Link>
                }
                <Link to="/projects" className="sidebarChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <AccountBalanceIcon />
                    <div className="sidebarChat_info">
                        <h2>Transactions</h2>
                    </div>
                </Link>
                <Link to="/billings" className="sidebarChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <ReceiptIcon />
                    <div className="sidebarChat_info">
                        <h2>Billing</h2>
                    </div>
                </Link>
                <Link to="/projects" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <div className="sidebarChat_info">
                        <SubdirectoryArrowRightIcon />
                        <p>Generate Bill</p>
                    </div>
                </Link>
                <Link to="/projects" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <div className="sidebarChat_info">
                        <SubdirectoryArrowRightIcon />
                        <p>Send SMS</p>
                    </div>
                </Link>
                <Link to="/projects" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <div className="sidebarChat_info">
                        <SubdirectoryArrowRightIcon />
                        <p>Send Email</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;
