import React, { useState } from 'react'
import CamByIdModels from './colmodels/CamByIdModels';
import ElecByIdModels from './colmodels/ElecByIdModels';
import Table from './table/Table';
import IndeterminateCheckbox from './table/IndeterminateCheckbox';


const ViewHistoryGrid = ({ bills, billType, setBills }) => {
    let models = billType == 1 ? CamByIdModels : ElecByIdModels;
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
            ...models()
        ],
        []
    );
    const data = React.useMemo(() => bills, [bills]);

    return (
        <>
            <Table
                columns={columns}
                data={data}
                onRowSelect={rows => setBills(rows)}
                hiddenColumns={[]}
            />
        </>
    )
}

export default ViewHistoryGrid;
