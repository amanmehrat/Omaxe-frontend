import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cm from "classnames";

import { useGet } from "../../utils/hooks";
import { LogException } from "../../utils/exception";
import Loading from '../Loading';
import NoData from "../NoData";
import Search from "../customInputs/Search";
import pencil_black from "../../img/pencil_black.svg";
import { useProjectActionsContext } from '../contexts/Project';

const Projects = ({ history }) => {
    const [oldProjects, setOldProjects] = useState(null)
    const [projects, setProjects] = useState(null)
    const [loading, setLoading] = useState(true);
    const setSelectedProjectId = useProjectActionsContext();
    const [searchText, setSearchText] = useState("");

    const { run: getProjectList } = useGet("/projects", null,
        {
            onResolve: (data) => {
                setProjects(data.projects);
                setOldProjects(data.projects);
                setLoading(false);
            },
            onReject: (error) => {
                LogException("Unable to get ProjectList", error);
                setLoading(false);
            }
        });

    useEffect(() => {
        console.log("project Null")
        setSelectedProjectId(null);
    }, []);

    useEffect(() => {
        getProjectList();
    }, [loading]);

    useEffect(() => {
        setLoading(true);
        searchProjects();
    }, [searchText]);

    const searchProjects = () => {
        const searchValue = searchText;
        let newProjects = [];
        if (searchValue == "") {
            newProjects = oldProjects;
        } else {
            newProjects = oldProjects.filter(obj => {
                return obj.name.toUpperCase().includes(searchValue.toUpperCase());
            });
        }
        setProjects(newProjects);
        setLoading(false);
    }

    const goToProject = (id) => { history.push("/project/" + id) }
    const renderProjects = () => {
        if (projects && projects.length > 0) {
            return [
                projects.map(project => {
                    let { id, name, startedOn } = project;
                    return (
                        <div key={id} className={cm("parentGrid", { "parentGrid__active": false })}
                            onClick={(e) => goToProject(id)}
                        >
                            <div className="child1 ">
                                <p className="text pointer">{name}</p>
                            </div>
                            <div className="child2">
                                <p className="text pointer">{startedOn}</p>
                            </div>
                            <div className="child3">
                                <p className="text pointer">{43536}</p>
                            </div>
                            <div className="child4">
                                <p className="text pointer">{123}</p>
                            </div>
                            <div className="child6">
                                <Link to={'/project/edit/' + id} onClick={(e) => e.stopPropagation()}>
                                    <img src={pencil_black}
                                        alt={"edit"}
                                        className="icon pointer"
                                    />
                                </Link>
                            </div>
                        </div >
                    )
                })
            ]
        } else {
            return <NoData />;
        }
    }
    return (
        <div className="projectId">
            <div className="projectId__header">
                <div className="projectId__body--heading">
                    <Search
                        setSearchText={setSearchText}
                        searchText={searchText}
                        placeholder="Search Flats"
                    />
                </div>
                <div className="projectId__header--filter">
                    <Link to="/project/add" className="projectId__header--filter--button" >Add Project</Link>
                </div>
            </div>
            <div className="projectId__body">
                <div key={0} className="parentGrid gridHeader">
                    <div className="child1">
                        <p className="text pointer">Project Name</p>
                    </div>
                    <div className="child2">
                        <p className="text pointer">Started On</p>
                    </div>
                    <div className="child3">
                        <p className="text pointer">Total Flats</p>
                    </div>
                    <div className="child4">
                        <p className="text pointer">Occupied Flats</p>
                    </div>
                    <div className="child6">
                        <p className="text pointer">Edit</p>
                    </div>
                </div>
                {loading ? <Loading /> : <div className="projectGrid">{renderProjects()}</div>}
            </div>
        </div>
    )
}

export default Projects;