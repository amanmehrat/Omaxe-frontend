
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import cm from "classnames";
import { Link } from 'react-router-dom';

import { useGet, usePost, usePut } from "../../utils/hooks";
import { errorContext } from "../../components/contexts/error/errorContext";
import AuthContext from "../../components/contexts/Auth";

import Search from '../customInputs/Search';
import ExportExcel from '../ExportExcel';
import Loading from '../Loading';
import NoData from "../NoData";
import pencil_black from "../../img/pencil_black.svg";

import './Project.css'


const Project = ({ history }) => {

    const { projectId } = useParams();

    const { user } = useContext(AuthContext);
    const errorCtx = useContext(errorContext);

    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [project, setProject] = useState(null);
    const [flats, setFlats] = useState(null);
    const [oldFlats, setOldFlats] = useState(null);
    const [exportOpen, setExportOpen] = useState(false);

    const handleExportOpen = () => {
        setExportOpen(true);
    };

    const handleExportClose = () => {
        setExportOpen(false);
    };
    const { run: getProjectById } = usePost("/projects/GetProject", null,
        {
            onResolve: (data) => {
                let requiredProject = data?.projects.find(project => project.id == projectId);
                requiredProject.projectsBillingInformations = requiredProject?.projectsBillingInformations?.find(billingInfo => billingInfo.proj_id == projectId);
                setProject(requiredProject);
            },
            onReject: (err) => {
                errorCtx.setError(err);
            }
        });
    const { run: getFlatsList } = usePost("/flats", null,
        {
            onResolve: (data) => {
                setFlats(data.flats);
                setOldFlats(data.flats);
                setLoading(false);
                // if (data && data.flats && data.flats[0] && data.flats[0].project)
                //     setProjectName(data.flats[0].project.name);
                // setTotalNoOfFlat(data.flats.length);
                // setLoading(false);
            },
            onReject: (error) => {
                console.log("error ------", error);
            }
        });


    useEffect(() => {
        if (projectId) {
            setLoading(true);
            getProjectById({ projId: projectId });
            getFlatsList({ projectId: projectId });
        }
    }, [projectId]);

    useEffect(() => {
        if (searchText && searchText != "") {
            setLoading(true);
            searchFlats();
        }
    }, [searchText]);

    const searchFlats = () => {
        const searchValue = searchText;
        console.log(searchValue);
        let newFlats = oldFlats.filter(obj => {
            return obj.residentName.toUpperCase().includes(searchValue.toUpperCase())
                || obj.ownerName.toUpperCase().includes(searchValue.toUpperCase())
                || obj.flatNumber.toUpperCase().includes(searchValue.toUpperCase())
                || obj.blockIncharge.toUpperCase().includes(searchValue.toUpperCase())
                || obj.meterNumber.toUpperCase().includes(searchValue.toUpperCase());
        });
        setFlats(newFlats);
        setLoading(false);
    }

    const renderFlats = () => {
        if (flats && flats.length > 0) {
            return [
                flats.map(flat => {
                    let { id, residentName, ownerName, propertyType, flatNumber, blockNumber } = flat;
                    return (
                        <div key={id} className={cm("parentGrid", { "parentGrid__active": false })}
                            onClick={(e) => {
                                //showDetails(e, id);
                            }}
                        >
                            <div className="child1 ">
                                <p className="text pointer">{flatNumber}</p>
                            </div>
                            <div className="child2">
                                <p className="text pointer">{blockNumber}</p>
                            </div>
                            <div className="child3">
                                <p className="text pointer">{residentName}</p>
                            </div>
                            <div className="child4">
                                <p className="text pointer">{ownerName}</p>
                            </div>
                            <div className="child5">
                                <p className="text pointer">{propertyType === 0 ? "3BHK" : "2BHK"}</p>
                            </div>
                            <div className="child6">
                                <Link to={`/AddFlat/${id}`} >
                                    <img src={pencil_black}
                                        alt={"edit"}
                                        className="icon pointer"
                                        onClick={(e) => e.stopPropagation()} />
                                </Link>
                            </div>
                        </div>
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
                    <Link className="projectId__header--filter--button" to="/Projects" >Add Flat</Link>
                    <Link onClick={() => handleExportOpen()} className="projectId__header--filter--button" >Export Excel</Link>
                    <Link onClick={() => console.log("Export Excel")} className="projectId__header--filter--button" >Import Excel</Link>
                </div>
            </div>
            <ExportExcel
                projectId={project?.id}
                open={exportOpen}
                handleOpen={handleExportOpen}
                handleClose={handleExportClose}
            />
            <div className="projectId__body">
                {project ?
                    <div className="projectId__body--header">
                        <div className="projectId__body--header-name">
                            <h1><Link to={"/project/" + projectId}><b>{project?.name}</b></Link></h1>
                        </div>
                        <div className="projectId__body--header-details">
                            <h3><b>Total No of Flats:</b> {flats?.length}</h3>
                            <h3><b>Number of Occupied Flats:</b> {flats?.length}</h3>
                            <h3><b>Number of vacant Flats: 0</b></h3><br />
                        </div>
                    </div>
                    : ''}
                <div key={0} className="parentGrid gridHeader">
                    <div className="child1">
                        <p className="text pointer">Flat No.</p>
                    </div>
                    <div className="child2">
                        <p className="text pointer">Block No.</p>
                    </div>
                    <div className="child3">
                        <p className="text pointer">Resident Name</p>
                    </div>
                    <div className="child4">
                        <p className="text pointer">Owner Name</p>
                    </div>
                    <div className="child5">
                        <p className="text pointer">Property Type</p>
                    </div>
                    <div className="child6">
                        <p className="text pointer">Edit</p>
                    </div>
                </div>
                {loading ? <Loading /> : <div className="projectGrid">{renderFlats()}</div>}
            </div>
        </div>
    )
}

export default Project;
