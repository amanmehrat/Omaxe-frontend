import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useGet } from "../../utils/hooks";
import { LogException } from "../../utils/exception";
import Loading from '../Loading';
import ProjectGrid from '../grid/ProjectGrid';
import NoData from "../NoData";
import { useProjectActionsContext } from '../contexts/Project';
import AuthContext from "../contexts/Auth";

const Projects = () => {
    const [projects, setProjects] = useState(null)
    const [loading, setLoading] = useState(true);
    const setSelectedProjectId = useProjectActionsContext();
    const { user } = useContext(AuthContext);

    const { run: getProjectList } = useGet("/projects", null,
        {
            onResolve: (data) => {
                setProjects(data.projects);
                setLoading(false);
            },
            onReject: (error) => {
                LogException("Unable to get ProjectList", error);
                setLoading(false);
            }
        });

    useEffect(() => {
        setSelectedProjectId(null);
    }, []);

    useEffect(() => {
        getProjectList();
    }, [loading]);

    const renderTransactions = () => {
        if (loading) {
            return <Loading />
        } if (projects == null) {
            return "";
        } else if (projects && projects.length > 0) {
            return <ProjectGrid projects={projects} />
        } else {
            return <NoData text="No Projects Found" />;
        }
    }
    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">
                    All Projects
                </div>
                <div className="project__header--filter">
                    {(user && user.role == "admin") &&
                        <Link to="/project/add" className="projectId__header--filter--button" >Add Project</Link>
                    }
                </div>
            </div>
            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        {loading ? <Loading /> : renderTransactions()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projects;