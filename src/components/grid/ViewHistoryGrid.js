import React from 'react'
import CamByIdModels from './colmodels/CamByIdModels';
import ElecByIdModels from './colmodels/ElecByIdModels';
import Table from './table/Table';


const ViewHistoryGrid = ({ bills, billType }) => {
    let models = billType == 1 ? CamByIdModels : ElecByIdModels;

    const columns = React.useMemo(() => [...models()], []);
    const data = React.useMemo(() => bills, [bills]);

    return (
        <>
            <Table
                columns={columns}
                data={data}
                hiddenColumns={[]}
            />
        </>
    )
}

export default ViewHistoryGrid;
