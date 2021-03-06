import { useHistory, useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { usePost } from "../../utils/hooks";
import NoData from "../NoData";
import Loading from "../Loading";
import ViewHistory from './ViewHistory';
import { useProjectActionsContext } from '../../components/contexts/Project';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        width: '78%',
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
    const history = useHistory();
    const { flatId } = useParams();

    const [loading, setLoading] = useState(true)

    console.log("flatId", flatId);

    const [flatDetails, setFlatDetails] = useState({});
    const [electricityHistory, setElectricityHistory] = useState([]);
    const [camHistory, setCamHistory] = useState([]);

    const [loadElectricity, setLoadElectricity] = useState(false);
    const [loadCam, setLoadCam] = useState(false);
    const [request, setRequest] = useState(null);

    const [popUpOpen, setPopUpOpen] = useState(false);
    const [popUpFor, setPopUpFor] = useState("");

    const handlePopUpOpen = (id) => { setPopUpFor(id); setPopUpOpen(true) };
    const handlePopUpClose = () => setPopUpOpen(false);

    const setSelectedProjectId = useProjectActionsContext();


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
            onReject: (error) => {
            }
        });

    const { run: getElectricityDetails } = usePost("/electricityDetails/GetElectricityDetailsByFlatId", null,
        {
            onResolve: (data) => {
                setLoadElectricity(false)
                setElectricityHistory(data.electricityHistory);
            },
            onReject: (error) => {
                setLoadElectricity(false)
                console.log("error fetchBy 0 ------", error);
            }
        });

    const { run: getCamDetails } = usePost("/camDetails/getCamById", null,
        {
            onResolve: (data) => {
                setLoadCam(false)
                console.log("Thhis is camDetail my array ", JSON.stringify(data));
                setCamHistory(data.camDetail);
            },
            onReject: (error) => {
                setLoadCam(false)
                console.log("error fetchBy 0 ------", error);
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
            console.log(loadElectricity);
            console.log(request);
            getElectricityDetails(request);
        }
    }, [loadElectricity]);

    useEffect(() => {
        if (loadCam) {
            console.log(loadCam);
            console.log(request);
            getCamDetails(request);
        }
    }, [loadCam]);

    if (loading) {
        return (
            <div className={classes.container}>
                <div className="project__header">
                    <div className="project__body--heading">Flat Details</div>
                    <div className="project__header--filter">
                        <Link className="project__header--filter--button" to={"/Billings"} >View All Flats</Link>
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
                <div className="project__body--heading">Flat Details</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/Billings"} >View All Flats</Link>
                </div>
            </div>
            <div className={classes.body}>
                {(flatDetails ?
                    (
                        <div className={classes.Details}>
                            <div className={classes.tableRow}>
                                <div className={classes.tableItem}>
                                    <label className={classes.tableItemKey}><b>Flat Number:</b></label>
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
                                        <label className={classes.tableItemKey}><b>MeterNumber:</b></label>
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
                                        <label className={classes.tableItemKey}><b>propertyType:</b></label>
                                        <div className={classes.tableItemValue}>{flatDetails.propertyType == 0 ? "3BHK" : "Others"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    : <NoData />)
                }
                <div className={classes.subHeading}>
                    <div className={classes.subHeadingText}><b>Electricity History</b></div>
                    <div className="project__header--filter">
                        <button onClick={(e) => { e.stopPropagation(); return handlePopUpOpen("Electricity"); }} className="projectId__header--filter--button" >View</button>
                    </div>
                </div>
                {
                    electricityHistory && electricityHistory.length > 0 ?
                        (
                            <table border={2} className={classes.table}>
                                <thead>
                                    <tr>
                                        <th>Bill Date</th>
                                        <th>Bill Number</th>
                                        <th>Amount</th>
                                        <th>Month</th>
                                        <th>Paid On</th>
                                        <th>Paid Via</th>
                                        <th>Receipt Number</th>
                                        <th>Total Consumption</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (
                                            Object.keys(electricityHistory).map((key) => {
                                                let { billDate, billNumber, amount, month, paidOn, paidVia, receiptNumber, totalConsumption } = electricityHistory[key]
                                                return (
                                                    <tr>
                                                        <td>{billDate}</td>
                                                        <td>{billNumber}</td>
                                                        <td>{amount}</td>
                                                        <td>{month}</td>
                                                        <td>{paidOn}</td>
                                                        <td>{paidVia}</td>
                                                        <td>{receiptNumber}</td>
                                                        <td>{totalConsumption}</td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                </tbody>
                            </table>
                        ) : <div className={classes.noData}>{loadElectricity ? "Loading..." : "No Bill In Histroy"}</div>
                }
                <div className={classes.subHeading}>
                    <div className={classes.subHeadingText}><b>CAM History</b></div>
                    <div className="project__header--filter">
                        <button onClick={(e) => { e.stopPropagation(); return handlePopUpOpen("Cam"); }} className="projectId__header--filter--button" >View</button>
                    </div>
                </div>
                {
                    camHistory && camHistory.length > 0 ?
                        (
                            <table border={2} className={classes.table}>
                                <thead className={classes.tableHead}>
                                    <tr>
                                        <th>Bill Date</th>
                                        <th>Bill Number</th>
                                        <th>Amount</th>
                                        <th>Month</th>
                                        <th>Paid On</th>
                                        <th>Paid Via</th>
                                        <th>Receipt Number</th>
                                    </tr>
                                </thead>
                                <tbody className={classes.tableBody}>
                                    {
                                        (
                                            Object.keys(camHistory).map((key) => {
                                                let { billDate, billNumber, amount, month, paidOn, paidVia, receiptNumber } = camHistory[key]
                                                return (
                                                    <tr className={classes.tableBodyRow}>
                                                        <td>{billDate}</td>
                                                        <td>{billNumber}</td>
                                                        <td>{amount}</td>
                                                        <td>{month}</td>
                                                        <td>{paidOn}</td>
                                                        <td>{paidVia}</td>
                                                        <td>{receiptNumber}</td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                </tbody>
                            </table>
                        ) : <div className={classes.noData}>{loadCam ? "Loading..." : "No Bill In Histroy"}</div>
                }
            </div>
            <ViewHistory
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