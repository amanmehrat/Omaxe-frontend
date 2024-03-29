import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { usePost } from "../utils/hooks";

import AuthContext from "./contexts/Auth";
import { useProjectContext } from './contexts/Project';

import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

import './Sidebar.css'

const Sidebar = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const { user } = useContext(AuthContext);
    const { selectedProjectId } = useProjectContext();
    const { run: getProjectById } = usePost("/projects/GetProject", null,
        {
            onResolve: (data) => {
                let requiredProject = data?.projects.find(project => project.id == selectedProjectId);
                if (requiredProject) {
                    requiredProject.projectsBillingInformations = requiredProject?.projectsBillingInformations?.find(billingInfo => billingInfo.proj_id == selectedProjectId);
                    setSelectedProject(requiredProject);
                }
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
                    {user && user.role == "admin" && <>
                        <Link to="/flat/add" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                            <div className="sidebarChat_info">
                                <SubdirectoryArrowRightIcon />
                                <p>Add Property</p>
                            </div>
                        </Link>
                        <Link to="/billing/GenerateBills" className="sidebarSubChat" /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                            <div className="sidebarChat_info">
                                <SubdirectoryArrowRightIcon />
                                <p>Generate Bills</p>
                            </div>
                        </Link>
                    </>
                    }
                    <Link to="/billing/ViewBills" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                        <div className="sidebarChat_info">
                            <SubdirectoryArrowRightIcon />
                            <p>View Bills</p>
                        </div>
                    </Link>
                    {
                        user && user.role == "admin" &&
                        <Link to="/billing/UpdateReadings" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                            <div className="sidebarChat_info">
                                <SubdirectoryArrowRightIcon />
                                <p>Update Readings</p>
                            </div>
                        </Link>
                    }
                    <Link to="/billing/waveOff" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                        <div className="sidebarChat_info">
                            <SubdirectoryArrowRightIcon />
                            <p>Wave-Off</p>
                        </div>
                    </Link>
                    {
                        user && user.role == "admin" &&
                        <Link to="/billing/ChequeBounce" className="sidebarSubChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                            <div className="sidebarChat_info">
                                <SubdirectoryArrowRightIcon />
                                <p>Cheque Bounce Entry</p>
                            </div>
                        </Link>
                    }
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
                {
                    user && user.role == "admin" && <Link to="/report" className="sidebarChat"  /*style={(selectedRoom == roomName) ? { backgroundColor: "gray" } : { backgroundColor: "white" }}*/  >
                        <PostAddIcon />
                        <div className="sidebarChat_info">
                            <h2>Report</h2>
                        </div>
                    </Link>
                }
            </div>
        </div>
    )
}

export default Sidebar;
