import React, { useState, useContext } from 'react'
import CamColModels from './colmodels/CamColModels';
import ElecColModels from './colmodels/ElecColModels';
import IndeterminateCheckbox from './table/IndeterminateCheckbox';
import Table from './table/Table';
import AddPayment from '../billing/AddPayment';
import { Link } from 'react-router-dom';
import cm from "classnames";
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import AuthContext from "../contexts/Auth";
import axios from 'axios';
import config from '../../config';
import ErrorPopUp from '../customInputs/ErrorPopUp';


const ViewBillsGrid = ({ bills, billType, setLoadViewBills }) => {
    localStorage.removeItem("downloadBillIds")
    const [selectedFlats, setSelectedFlats] = useState([]);
    const [errorObject, setErrorObject] = useState("");
    const [importOpen, setImportOpen] = useState(false);
    const [importErrorOpen, setErrorImportOpen] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [selectedflatId, setSelectedFlatId] = useState(null);
    let models = billType == 1 ? CamColModels : ElecColModels;
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleErrorImportOpen = () => setErrorImportOpen(true);
    const handleErrorImportClose = () => setErrorImportOpen(false);

    const columns = React.useMemo(
        () => [
            {
                id: "selection",
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div>
                        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                Cell: ({ row }) => (
                    <div>
                        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                    </div>
                )
            },
            ...models(setSelectedBillId, setImportOpen, setSelectedFlatId)
        ],
        []
    );
    const data = React.useMemo(() => bills, [bills]);
    const renderBillTypeText = () => { if (billType == 1) { return "Cam Bills" } else if (billType == 2) { return "Electricity Bills" } else { return "Adhoc Bills" } }

    const sendBills = (requestData) => {
        setErrorImportOpen(true);

        axios.post(`${config.restApiBase}/billing/mailBills`, requestData)
            .then(({ data }) => {
                data = data.data;
                if (data != null && data?.error != null && data?.error != undefined && data.error.length > 0) {
                    let ErrorTable = "<table border='1' class='generateBillTable'><thead><tr><th>PropertyNo.</th><th>error</th><th>PropertyNo.</th><th>error</th><th>PropertyNo.</th><th>error</th></tr></thead><tbody>";
                    let count = 0;
                    data.error.forEach(element => {
                        if (count == 0) ErrorTable += "<tr>";
                        ErrorTable += `<td><b>${element.flatNumber}</b></td><td>${element.error}</td>`;
                        if (count == 2) { ErrorTable += "</tr>"; count = 0; } else { count++; }
                    });
                    ErrorTable += "</tbody></table>";
                    setErrorObject(ErrorTable);
                } else if (data != null && data.message != undefined) {
                    setErrorObject(data.message);
                }
                //errorCtx.setSuccess("Bill Generated Successfully");
                setLoading(false);
            }).catch((error) => {
                console.log(error);
            });
    }
    const generateBills = () => {
        setErrorObject("");
        setLoading(true);
        let billIds = selectedFlats.map(d => d.original.id);
        sendBills({
            billIds: billIds,
            billType: parseInt(billType)
        });
    }
    return (
        <>
            <div className="billsHeading">
                <div className="billsSubHeading">
                    {renderBillTypeText()}
                </div>
                <div>
                    {selectedFlats.length > 0 &&
                        <button
                            className={cm("project__header--filter--button", "materialBtn")}
                            target="_blank"
                            onClick={() => generateBills()}
                        >
                            <PrintOutlinedIcon />
                        Send Bills
                    </button>
                    }
                    {selectedFlats.length > 0 &&
                        <Link
                            to={'/Bills/' + billType}
                            className={cm("project__header--filter--button", "materialBtn")}
                            target="_blank"
                            onClick={() => { localStorage.setItem("downloadBillIds", selectedFlats.map(d => d.original.id)) }}
                        >
                            <PrintOutlinedIcon />
                        Print Bills
                    </Link>
                    }
                </div>
            </div>
            <Table
                columns={columns}
                data={data}
                onRowSelect={rows => setSelectedFlats(rows)}
                hiddenColumns={(user && user.role == "admin") ? [] : ["Payment", "Edit"]}
            />
            <AddPayment
                billId={selectedBillId}
                flatid={selectedflatId}
                paidFor={billType}
                open={importOpen}
                setImportOpen={setImportOpen}
                setLoadViewBills={setLoadViewBills}
            />
            <ErrorPopUp
                open={importErrorOpen}
                handleOpen={handleErrorImportOpen}
                handleClose={handleErrorImportClose}
                data={errorObject}
                loading={loading}
                setLoading={setLoading}
                loadingMessage="Sending Bill..."
                successMessage="Bill Sent"
            />
        </>
    )
}

export default React.memo(ViewBillsGrid);
