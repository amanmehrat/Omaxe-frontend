import useReactRouter from 'use-react-router';
import React, { useState, useEffect } from 'react';
import cm from "classnames";

import { usePost } from "../../utils/hooks";
import NoData from "../../components/NoData";
import Loading from "../../components/Loading";
import "./flatById.scss";

const FlatById = () => {
    const { history, match: { path: matchPath, url: matchUrl, params: { flatId } } } = useReactRouter();

    const [flatDetails, setFlatDetails] = useState({});
    const [electricityHistory, setElectricityHistory] = useState([]);
    const [camHistory, setCamHistory] = useState([]);
    const [loadGetData, setLoadGetData] = useState(true);
    const [loading, setLoading] = useState(true)

    const { run: getFlatDetails } = usePost("/flats/getFlat", { flatId },
        {
            onResolve: (data) => {
                //console.log( "Thhis is my array ", JSON.stringify(data));
                setFlatDetails(data.flat);
                setLoading(false);
            },
            onReject: (error) => {
                console.log("error ------", error);
            }
        });

    const { run: getElectricityDetails } = usePost("/electricityDetails/GetElectricityDetailsByFlatId", { flatId, fetchBy: 0 },
        {
            onResolve: (data) => {
                setElectricityHistory(data.electricityHistory);
            },
            onReject: (error) => {
                console.log("error fetchBy 0 ------", error);
            }
        });

    const { run: getCamDetails } = usePost("/camDetails/getCamById", { flatId, fetchBy: 0 },
        {
            onResolve: (data) => {
                console.log("Thhis is camDetail my array ", JSON.stringify(data));
                setCamHistory(data.camDetail);
            },
            onReject: (error) => {
                console.log("error fetchBy 0 ------", error);
            }
        });

    useEffect(() => {
        setLoadGetData(false);
        getFlatDetails();
        getElectricityDetails();
        getCamDetails();
    }, [loadGetData]);

    return (
        <div className="myflatById">
            <div className="midContainer">
                <div className="midContainer__body">
                    {
                        loading ? <Loading /> : (flatDetails ?
                            (
                                <table>
                                    <tr>
                                        <td><b>Project Name:</b></td>
                                        <td>{flatDetails.project?.name}</td>
                                        <td><b>Area:</b></td>
                                        <td>{flatDetails.area}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Resident Name:</b></td>
                                        <td>{flatDetails.residentName}</td>
                                        <td><b>Owner Name:</b></td>
                                        <td>{flatDetails.ownerName}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Floor Number:</b></td>
                                        <td>{flatDetails.floorNumber}</td>
                                        <td><b>Flat Number:</b></td>
                                        <td>{flatDetails.flatNumber}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Date Of Possession:</b></td>
                                        <td>{flatDetails.dateOfPossession}</td>
                                        <td><b>Block Number:</b></td>
                                        <td>{flatDetails.blockNumber}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Block Incharge:</b></td>
                                        <td>{flatDetails.blockIncharge}</td>
                                        <td><b>Meter Number:</b></td>
                                        <td>{flatDetails.meterNumber}</td>
                                    </tr>

                                </table>
                            )
                            : <NoData />)
                    }
                    <div>
                        <button className="divbutton">Electricity History</button>
                        <button className="divbutton">CAM History</button>
                    </div>
                    <h1 className="subHeading">Electricity History</h1>
                    {
                        electricityHistory && electricityHistory.length > 0 ?
                            (
                                <table>
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
                                            }
                                            ))
                                    }
                                </table>
                            ) : <h3>No Bill In Histroy</h3>
                    }


                    <h1 className="subHeading">CAM History</h1>
                    {
                        camHistory && camHistory.length > 0 ?
                            (
                                <table>
                                    <tr>
                                        <th>Bill Date</th>
                                        <th>Bill Number</th>
                                        <th>Amount</th>
                                        <th>Month</th>
                                        <th>Paid On</th>
                                        <th>Paid Via</th>
                                        <th>Receipt Number</th>
                                    </tr>
                                    {
                                        (
                                            Object.keys(camHistory).map((key) => {
                                                let { billDate, billNumber, amount, month, paidOn, paidVia, receiptNumber } = camHistory[key]
                                                return (
                                                    <tr>
                                                        <td>{billDate}</td>
                                                        <td>{billNumber}</td>
                                                        <td>{amount}</td>
                                                        <td>{month}</td>
                                                        <td>{paidOn}</td>
                                                        <td>{paidVia}</td>
                                                        <td>{receiptNumber}</td>
                                                    </tr>
                                                )
                                            }
                                            ))
                                    }
                                </table>
                            ) : <h3>No Bill In Histroy</h3>
                    }
                </div>
            </div>
        </div>
    );
};

export default FlatById;