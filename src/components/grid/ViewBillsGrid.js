import React, { useState } from 'react'
import CamColModels from './colmodels/CamColModels';
import ElecColModels from './colmodels/ElecColModels';
import IndeterminateCheckbox from './table/IndeterminateCheckbox';
import Table from './table/Table';
import cm from "classnames";

import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';

const ViewBillsGrid = ({ bills, billType }) => {
    const [selectedFlats, setSelectedFlats] = useState([])
    let models = billType == 1 ? CamColModels : ElecColModels;
    console.log("ViewBillsGrid", billType);
    console.log("ViewBillsGrid", models());
    console.log("setSelectedFlatIds", selectedFlats);
    const columns = React.useMemo(
        () => [
            {
                id: "selection",
                // The header can use the table's getToggleAllRowsSelectedProps method
                // to render a checkbox
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div>
                        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                // The cell can use the individual row's getToggleRowSelectedProps method
                // to the render a checkbox
                Cell: ({ row }) => (
                    <div>
                        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                    </div>
                )
            },
            ...models()
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
                        onClick={(e) => { e.stopPropagation(); downloadBills(selectedFlats.map(d => d.original.flatId)) }}>
                        <GetAppOutlinedIcon />Download Bills</button>
                    <button className={cm("project__header--filter--button", "materialBtn")}
                        onClick={(e) => { e.stopPropagation(); printBills(selectedFlats.map(d => d.original.flatId)) }}>
                        <PrintOutlinedIcon />Print Bills</button>
                </div>
            </div>
            <Table
                columns={columns}
                data={data}

                onRowSelect={rows => setSelectedFlats(rows)}
            />
        </>
    )
}

export default ViewBillsGrid;
