import React, { useState } from 'react'
import CamByIdModels from './colmodels/CamByIdModels';
import ElecByIdModels from './colmodels/ElecByIdModels';
import Table from './table/Table';


const ViewHistoryGrid = ({ bills, billType }) => {
    let models = billType == 1 ? CamByIdModels : ElecByIdModels;
    console.log("ViewBillsGrid", billType);
    console.log("ViewBillsGrid", models());

    const columns = React.useMemo(() => [...models()], []);
    const data = React.useMemo(() => bills, [bills]);

    const renderBillTypeText = () => { if (billType == 1) { return "Cam History" } else if (billType == 2) { return "Electricity History" } else { return "Adhoc Bills" } }
    return (
        <>
            <Table
                columns={columns}
                data={data}
            />
        </>
    )
}

export default ViewHistoryGrid;
