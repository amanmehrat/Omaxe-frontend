
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import cm from "classnames";
import { Link } from 'react-router-dom';

import { usePost } from "../../utils/hooks";
import { errorContext } from "../../components/contexts/error/errorContext";
import { LogException } from "../../utils/exception";
import { useProjectActionsContext } from '../../components/contexts/Project';

import Search from '../customInputs/Search';
import ExportExcel from '../ExportExcel';
import ImportExcel from '../ImportExcel';
import Loading from '../Loading';
import NoData from "../NoData";
import pencil_black from "../../img/pencil_black.svg";
import FlatGrid from '../grid/FlatGrid';
import PropertyType from '../../utils/PropertyTypeSet';

import './Project.css'


const Project = () => {
    let history = useHistory();
    const { projectId } = useParams();
    const errorCtx = useContext(errorContext);

    const [loading, setLoading] = useState(true);
    const [loadFlats, setLoadFlats] = useState(false);
    const [project, setProject] = useState(null);
    const [flats, setFlats] = useState(null);
    const [oldFlats, setOldFlats] = useState(null);
    const [exportOpen, setExportOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const setSelectedProjectId = useProjectActionsContext();

    const handleExportOpen = () => setExportOpen(true);
    const handleExportClose = () => setExportOpen(false);
    const handleImportOpen = () => setImportOpen(true);
    const handleImportClose = () => setImportOpen(false);

    const { run: getProjectById } = usePost("/projects/GetProject", null,
        {
            onResolve: (data) => {
                setLoadFlats(false);
                let requiredProject = data?.projects.find(project => project.id == projectId);
                requiredProject.projectsBillingInformations = requiredProject?.projectsBillingInformations?.find(billingInfo => billingInfo.proj_id == projectId);
                setProject(requiredProject);
            },
            onReject: (err) => {
                setLoadFlats(false);
                LogException("Unable To get Project By Id", err);
                //errorCtx.setError(err);
            }
        });
    const { run: getFlatsList } = usePost("/flats", null,
        {
            onResolve: (data) => {
                console.log("data", data);
                setFlats([]);
                if (data?.flats != undefined) {
                    data.flats.map(item => { item.propertyType = PropertyType.get(item.propertyType); return item; })
                    setFlats(data.flats);
                }
                setLoading(false);
                // if (data && data.flats && data.flats[0] && data.flats[0].project)
                //     setProjectName(data.flats[0].project.name);
                // setTotalNoOfFlat(data.flats.length);
                // setLoading(false);
            },
            onReject: (err) => {
                setFlats([]);
                setLoading(false);
                LogException("Unable To get Flat List", err);
            }
        });


    useEffect(() => {
        if (projectId) {
            setLoading(true);
            setSelectedProjectId(projectId);
            getProjectById({ projId: projectId });
            getFlatsList({ projectId: projectId });
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId && loadFlats) {
            getFlatsList({ projectId: projectId });
        }
    }, [loadFlats]);


    const renderFlats = () => {
        console.log(flats);
        if (loading) {
            return <Loading />
        } if (flats == null) {
            return "";
        } else if (flats && flats.length > 0) {
            return <FlatGrid flats={flats} />
        } else {
            return <NoData text="No Flats Found" />;
        }
    }
    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">
                    All Properties
                </div>
                <div className="project__header--filter">
                    <Link to="/flat/add" className="project__header--filter--button" >Add Property</Link>
                    <button onClick={(e) => { e.stopPropagation(); return handleExportOpen() }} className="projectId__header--filter--button" >Export Excel</button>
                    <button onClick={(e) => { e.stopPropagation(); return handleImportOpen() }} className="projectId__header--filter--button" >Import Excel</button>
                </div>
            </div>
            <ExportExcel
                projectId={project?.id}
                open={exportOpen}
                handleOpen={handleExportOpen}
                handleClose={handleExportClose}
            />
            <ImportExcel
                projectId={project?.id}
                open={importOpen}
                handleOpen={handleImportOpen}
                handleClose={handleImportClose}
                setLoadFlats={setLoadFlats}
            />
            <div className="project__body">
                {project ?
                    <div className="projectId__body--header">
                        <div className="projectId__body--header-name">
                            <h1 style={{ color: "#637390" }}><Link to={"/project/" + projectId}><b>{project?.name}</b></Link></h1>
                            <h3>Address - {project?.address} </h3>
                        </div>
                        <div className="projectId__body--header-details">
                            <h3><b>Total No of Flats:</b> {project?.totalUnits}</h3>
                            <h3><b>Number of Occupied Flats:</b> {flats?.length}</h3>
                        </div>
                    </div>
                    : ''}
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        {loading ? <Loading /> : renderFlats()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project;
