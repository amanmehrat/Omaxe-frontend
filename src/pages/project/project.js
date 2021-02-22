import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cm from "classnames";

import { useGet, usePost } from "../../utils/hooks";
import NoData from "../../components/NoData";
import Loading from "../../components/Loading";
import search from "../../img/search.svg";
import pencil_black from "../../img/pencil_black.svg";
//import "./project.scss";

const Project = ({ history }) => {
    const [oldProjects, setOldProjects] = useState(null)
    const [projects, setProjects] = useState(null)
    const [loadGetData, setLoadGetData] = useState(true);
    const [loading, setLoading] = useState(true)


    const { run: getProjectList } = useGet("/projects", null,
        {
            onResolve: (data) => {
                setProjects(data.projects);
                setOldProjects(data.projects);
                setLoading(false);
            },
            onReject: (error) => {
                console.log("error ------", error);
            }
        });

    useEffect(() => {
        setLoadGetData(false);
        getProjectList();
    }, [loadGetData]);

    const showFlatList = (e, id) => {
        e.preventDefault();
        history.push("/project/" + id);
    }

    const searchText = (e) => {
        e.preventDefault();
        const searchValue = e.target.value;
        let newProject = oldProjects.filter(obj => {
            return obj.name.toUpperCase().includes(searchValue.toUpperCase());
        });
        setProjects(newProject);
    }

    return (
        <div className="myprojects">
            <div className="midContainer">
                <div className="midContainer__head">

                    <div className="midContainer__head--field">
                        <img
                            src={search}
                            alt="search"
                            className="midContainer__head--field--search"
                        />
                        <input
                            onChange={(e) => searchText(e)}
                            type="text"
                            placeholder="search"
                            className="midContainer__head--field--input"
                        />
                    </div>


                    <div className="midContainer__head--filter">
                        <Link className="midContainer__head--filter--button" to="/AddProject" >Add Project</Link>
                    </div>

                </div>
                <div className="midContainer__body">
                    {
                        loading ? <Loading /> : (projects && Object.keys(projects).length ?
                            (Object.keys(projects).map((key) => {
                                let { id, name, startedOn } = projects[key]
                                return (
                                    <div className={cm("contentMid", { "contentMid__active": false })}
                                        onClick={(e) => {
                                            showFlatList(e, id);
                                        }}
                                    >
                                        <div className="text1 ">
                                            <p className="text pointer">{name}</p>
                                        </div>
                                        <div className="text2">
                                            <p className="text pointer">{startedOn}</p>
                                        </div>
                                        <div className="text5">
                                            <Link to={`/AddProject/${id}`} >
                                                <img src={pencil_black} alt={"edit"} className="icon pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                    }} />

                                            </Link>
                                        </div>
                                    </div>
                                )

                            })
                            )
                            : <NoData />)
                    }
                </div>
            </div>
        </div >
    )
}

export default Project;