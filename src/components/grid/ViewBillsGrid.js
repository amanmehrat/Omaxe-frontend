import React, { useState } from 'react'
import CamColModels from './colmodels/CamColModels';
import ElecColModels from './colmodels/ElecColModels';
import IndeterminateCheckbox from './table/IndeterminateCheckbox';
import Table from './table/Table';
import cm from "classnames";
import AddPayment from '../billing/AddPayment';

import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';

const ViewBillsGrid = ({ bills, billType, setLoadViewBills }) => {
    const [selectedFlats, setSelectedFlats] = useState([])
    const [importOpen, setImportOpen] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);
    let models = billType == 1 ? CamColModels : ElecColModels;
    const handleImportClose = () => setImportOpen(false);

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
            ...models(setSelectedBillId, setImportOpen)
        ],
        []
    );
    const data = React.useMemo(() => bills, [bills]);
    const downloadBills = (flatsNos) => {
        console.log("downloadBills", flatsNos);
    }
    const printBills = (flatsNos) => {
        console.log("printBills", flatsNos);
    }

    const renderBillTypeText = () => { if (billType == 1) { return "Cam Bills" } else if (billType == 2) { return "Electricity Bills" } else { return "Adhoc Bills" } }
    return (
        <>
            <div className="billsHeading">
                <div className="billsSubHeading">
                    {renderBillTypeText()}
                </div>
                <div>
                    <button className={cm("project__header--filter--button", "materialBtn")}
                        onClick={(e) => { e.stopPropagation(); downloadBills(selectedFlats.map(d => d.original.flatId)) }}
                    >
                        <GetAppOutlinedIcon />
                        Download Bills
                    </button>
                </div>
            </div>
            <Table
                columns={columns}
                data={data}
                onRowSelect={rows => setSelectedFlats(rows)}
            />
            <AddPayment
                billId={selectedBillId}
                paidFor={billType}
                open={importOpen}
                setImportOpen={setImportOpen}
                setLoadViewBills={setLoadViewBills}
            />
        </>
    )
}

export default React.memo(ViewBillsGrid);
