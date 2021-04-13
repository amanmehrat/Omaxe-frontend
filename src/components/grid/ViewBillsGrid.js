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


const ViewBillsGrid = ({ bills, billType, setLoadViewBills }) => {
    localStorage.removeItem("downloadBillIds")
    const [selectedFlats, setSelectedFlats] = useState([])
    const [importOpen, setImportOpen] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [selectedflatId, setSelectedFlatId] = useState(null);
    let models = billType == 1 ? CamColModels : ElecColModels;
    const { user } = useContext(AuthContext);
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
    return (
        <>
            <div className="billsHeading">
                <div className="billsSubHeading">
                    {renderBillTypeText()}
                </div>
                <div>
                    <Link
                        to={'/Bills/' + billType}
                        className={cm("project__header--filter--button", "materialBtn")}
                        target="_blank"
                        onClick={() => { localStorage.setItem("downloadBillIds", selectedFlats.map(d => d.original.id)) }}
                    >
                        <PrintOutlinedIcon />
                        Print Bills
                    </Link>
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
        </>
    )
}

export default React.memo(ViewBillsGrid);
