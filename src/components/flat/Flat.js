import { useHistory, useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { usePost } from "../../utils/hooks";
import NoData from "../NoData";
import Loading from "../Loading";
import ViewHistoryGrid from '../grid/ViewHistoryGrid';
import HistoryModal from './HistoryModal';
import { LogException } from "../../utils/exception";
import { useProjectActionsContext, useProjectContext } from '../../components/contexts/Project';
import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        width: '80%',
        margin: '10px',
        height: 'calc(100vh - 7rem)',
        flexDirection: 'column'
    },
    Details: {
        color: '#637390',
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        padding: '1rem 1.2rem 1rem 1.2rem',
        margin: '0 0 1.5rem 0.4rem',
        fontSize: '1rem',
    },
    body: {
        backgroundColor: '#ececec',
        padding: '1.3rem',
        height: '100%'
    },
    tableRow: {
        display: 'flex',
        width: '100%',
        fontSize: '1.8rem',
        justifyContent: 'space-between',
    },
    tableItem: {
        width: '100%',
        display: 'flex',
        margin: '3px 5px',
        padding: '2px',
        alignItems: 'center'
    },
    tableItemKey: { width: '50%' },
    tableItemValue: { width: '50%' },
    table: {
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        margin: '0.2rem 0.4rem',
        padding: '0.5rem',
        fontSize: '1.5rem',
        textAlign: 'center',
        width: '100%',
        color: '#637390',
    },
    tableHead: {},
    tableBody: {},
    tableBodyRow: {},
    tableBodyRowItem: {},
    subHeading: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0rem 1rem',
        fontSize: '1.5rem',
        backgroundColor: 'white',
        color: '#637390'
    },
    subHeadingText: {},
    noData: {
        textAlign: 'center',
        border: '1px solid #637390',
        color: "#637390",
        fontSize: '1.2rem',
        marginBottom: '20px'
    },
}));

const Flat = () => {
    const classes = useStyles();
    const { flatId } = useParams();

    const [loading, setLoading] = useState(true)
    const [flatDetails, setFlatDetails] = useState({});
    const [electricityHistory, setElectricityHistory] = useState([]);
    const [camHistory, setCamHistory] = useState([]);

    const [loadElectricity, setLoadElectricity] = useState(true);
    const [loadCam, setLoadCam] = useState(true);
    const [request, setRequest] = useState({
        flatId: flatId,
        fetchBy: 1,
        fetchData: {
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        }
    });

    const [popUpOpen, setPopUpOpen] = useState(false);
    const [popUpFor, setPopUpFor] = useState("");

    const handlePopUpOpen = (id) => { setPopUpFor(id); setPopUpOpen(true) };
    const handlePopUpClose = () => setPopUpOpen(false);

    const setSelectedProjectId = useProjectActionsContext();
    const { selectedProjectId } = useProjectContext();

    const { run: getFlatDetails } = usePost("/flats/getFlat", null,
        {
            onResolve: (data) => {
                setSelectedProjectId(data.flat.projectId);
                setFlatDetails(data.flat);
                setLoading(false);
                if (data.flat?.CAMHistories?.length > 0) {
                    setCamHistory(data.flat?.CAMHistories);
                }
                if (data.flat?.electricityHistories?.length > 0) {
                    setElectricityHistory(data.flat?.electricityHistories);
                }
            },
            onReject: (err) => {
                LogException("Unable To get Flat Details", err);
            }
        });

    const { run: getElectricityDetails } = usePost("/electricityDetails/GetElectricityDetailsByFlatId", null,
        {
            onResolve: (data) => {
                setLoadElectricity(false)
                setElectricityHistory(data.electricityHistory);
            },
            onReject: (err) => {
                setLoadElectricity(false)
                LogException("Unable To get Electricity Details", err);
            }
        });

    const { run: getCamDetails } = usePost("/camDetails/getCamById", null,
        {
            onResolve: (data) => {
                setLoadCam(false)
                setCamHistory(data.camDetail);
            },
            onReject: (err) => {
                setLoadCam(false)
                LogException("Unable To get Cam details Details", err);
            }
        });

    useEffect(() => {
        if (flatId) {
            setLoading(true);
            getFlatDetails({ flatId });
        }
    }, [flatId]);

    useEffect(() => {
        if (loadElectricity) {
            getElectricityDetails(request);
        }
    }, [loadElectricity]);

    useEffect(() => {
        if (loadCam) {
            getCamDetails(request);
        }
    }, [loadCam]);
    const downloadCamHistory = () => {
        axios.post(`${config.restApiBase}/camDetails/getCamById`,
            {
                flatId: flatId,
                fetchBy: 3,
                fetchData: request.fetchData
            }
        ).then(response => {
            let { data } = response;
            if (data && data.meta) {
                LogException("Unable To Download Cam history. Please Contact To Tech-Team");
            } else {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Camhistory-${request.year}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }).catch((error) => {
            setLoading(false);
            LogException("Unable To Download Cam History excel" + error);
        });
    }

    const downloadElecHistory = () => {
        axios.post(`${config.restApiBase}/electricityDetails/GetElectricityDetailsByFlatId`,
            {
                flatId: flatId,
                fetchBy: 3,
                fetchData: request.fetchData
            }
        ).then(response => {
            let { data } = response;
            if (data && data.meta) {
                LogException("Unable To Download Electricity history. Please Contact To Tech-Team");
            } else {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Electricityhistory-${request.year}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }).catch((error) => {
            setLoading(false);
            LogException("Unable To Download Electricity History excel" + error);
        });
    }

    if (loading) {
        return (
            <div className={classes.container}>
                <div className="project__header">
                    <div className="project__body--heading">Property Details</div>
                    <div className="project__header--filter">
                        <Link className="project__header--filter--button" to={"/project/" + setSelectedProjectId} >View All Properties</Link>
                    </div>
                </div>
                <div className={classes.body}>
                    <Loading />
                </div>
            </div>
        )
    }

    return (
        <div className={classes.container}>
            <div className="project__header">
                <div className="project__body--heading">Property Details</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/Project/" + selectedProjectId} >View All properties</Link>
                </div>
            </div>
            <div className={classes.body}>
                {(flatDetails ?
                    (
                        <div className={classes.Details}>
                            <div className={classes.tableRow}>
                                <div className={classes.tableItem}>
                                    <label className={classes.tableItemKey}><b>Property Number:</b></label>
                                    <div className={classes.tableItemValue}>{flatDetails.flatNumber}</div>
                                </div>
                                <div className={classes.tableRow}>
                                    <div className={classes.tableItem}>
                                        <label className={classes.tableItemKey}><b>Floor Number:</b></label>
                                        <div className={classes.tableItemValue}>{flatDetails.floorNumber}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.tableRow}>
                                <div className={classes.tableItem}>
                                    <label className={classes.tableItemKey}><b>Block No:</b></label>
                                    <div className={classes.tableItemValue}>{flatDetails.blockNumber}</div>
                                </div>
                                <div className={classes.tableRow}>
                                    <div className={classes.tableItem}>
                                        <label className={classes.tableItemKey}><b>Area:</b></label>
                                        <div className={classes.tableItemValue}>{flatDetails.area}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.tableRow}>
                                <div className={classes.tableItem}>
                                    <label className={classes.tableItemKey}><b>Resident Name:</b></label>
                                    <div className={classes.tableItemValue}>{flatDetails.residentName}</div>
                                </div>
                                <div className={classes.tableRow}>
                                    <div className={classes.tableItem}>
                                        <label className={classes.tableItemKey}><b>Owner Name:</b></label>
                                        <div className={classes.tableItemValue}>{flatDetails.ownerName}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.tableRow}>
                                <div className={classes.tableItem}>
                                    <label className={classes.tableItemKey}><b>Date Of Possession:</b></label>
                                    <div className={classes.tableItemValue}>{flatDetails.dateOfPossession}</div>
                                </div>
                                <div className={classes.tableRow}>
                                    <div className={classes.tableItem}>
                                        <label className={classes.tableItemKey}><b>Meter Number:</b></label>
                                        <div className={classes.tableItemValue}>{flatDetails.meterNumber}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.tableRow}>
                                <div className={classes.tableItem}>
                                    <label className={classes.tableItemKey}><b>Block Incharge:</b></label>
                                    <div className={classes.tableItemValue}>{flatDetails.blockIncharge}</div>
                                </div>
                                <div className={classes.tableRow}>
                                    <div className={classes.tableItem}>
                                        <label className={classes.tableItemKey}><b>Property Type:</b></label>
                                        <div className={classes.tableItemValue}>{flatDetails.propertyType == 0 ? "3BHK" : "Others"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    : <NoData />)
                }
                <div className={classes.subHeading}>
                    <div className={classes.subHeadingText}><b>CAM History</b></div>
                    <div className="project__header--filter">
                        <button onClick={(e) => { e.stopPropagation(); return handlePopUpOpen("Cam"); }} className="projectId__header--filter--button" >View</button>
                        {(request.fetchBy == 2) && <button onClick={(e) => { e.stopPropagation(); return downloadCamHistory(); }} className="projectId__header--filter--button" >Download</button>}
                    </div>
                </div>
                {(camHistory && camHistory.length > 0) ?
                    <ViewHistoryGrid bills={camHistory} billType={1} />
                    : <div className={classes.noData}>{loadCam ? "Loading..." : "No Bill In Histry"}</div>
                }
                <div className={classes.subHeading}>
                    <div className={classes.subHeadingText}><b>Electricity History</b></div>
                    <div className="project__header--filter">
                        <button onClick={(e) => { e.stopPropagation(); return handlePopUpOpen("Electricity"); }} className="projectId__header--filter--button" >View</button>
                        {(request.fetchBy == 2) && <button onClick={(e) => { e.stopPropagation(); return downloadElecHistory(); }} className="projectId__header--filter--button" >Download</button>}
                    </div>
                </div>
                {(electricityHistory && electricityHistory.length > 0) ?
                    <ViewHistoryGrid bills={electricityHistory} billType={2} />
                    : <div className={classes.noData}>{loadElectricity ? "Loading..." : "No Bill In Histry"}</div>
                }
            </div>
            <HistoryModal
                open={popUpOpen}
                handlePopUpClose={handlePopUpClose}
                popUpFor={popUpFor}
                flatId={flatId}
                setLoadElectricity={setLoadElectricity}
                setLoadCam={setLoadCam}
                setRequest={setRequest}
            />
        </div>
    );
};

export default Flat;