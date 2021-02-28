import React, { useState, useEffect, useContext } from 'react'
import { useHistory, Link } from 'react-router-dom';
import { useGet, usePost, usePut } from "../utils/hooks";

import AuthContext from "./contexts/Auth";
import { useProjectContext } from './contexts/Project';

import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

import './Sidebar.css'

const Sidebar = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const { user, logout } = useContext(AuthContext);
    const { selectedProjectId } = useProjectContext();

    const { run: getProjectById } = usePost("/projects/GetProject", null,
        {
            onResolve: (data) => {
                let requiredProject = data?.projects.find(project => project.id == selectedProjectId);
                requiredProject.projectsBillingInformations = requiredProject?.projectsBillingInformations?.find(billingInfo => billingInfo.proj_id == selectedProjectId);
                setSelectedProject(requiredProject);
            },
            onReject: (err) => {

            }
        });

    useEffect(() => {
        if (selectedProjectId) {
            getProjectById({ projId: selectedProjectId });
        } else {
            setSelectedProject(null);
        }
    }, [selectedProjectId]);


    return (
        <div className="sidebar">
            <div className="sidebar__chats">
                <Link to="/projects" className="sidebarChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <AssessmentIcon />
                    <div className="sidebarChat_info">
                        <h2>Projects</h2>
                    </div>
                </Link>
                {selectedProject && <>
                    <Link to={"/project/" + selectedProjectId} className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                        <div className="sidebarChat_info">
                            <SubdirectoryArrowRightIcon />
                            <p>{selectedProject?.name}</p>
                        </div>
                    </Link>
                    <Link to="/flat/new" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                        <div className="sidebarChat_info">
                            <SubdirectoryArrowRightIcon />
                            <p>Add Flat</p>
                        </div>
                    </Link>
                    <Link to="/project/Billing" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                        <div className="sidebarChat_info">
                            <SubdirectoryArrowRightIcon />
                            <p>Generate Bill</p>
                        </div>
                    </Link>
                </>
                }
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
                <Link to="/project/billings" className="sidebarChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                    <ReceiptIcon />
                    <div className="sidebarChat_info">
                        <h2>Billing</h2>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;
