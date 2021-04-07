import React from 'react'
import FlatsModels from './colmodels/FlatsModels';
import Table from './table/Table';
import { useHistory } from 'react-router-dom';

const FlatGrid = ({ flats }) => {
    const history = useHistory();
    let models = FlatsModels;
    const columns = [...models()]
    const data = React.useMemo(() => flats, [flats]);
    return (
        <>
            <Table
                columns={columns}
                data={data}
                onHandleRowClick={id => { history.push("/flats/" + id) }}
            />
        </>
    )
}
export default FlatGrid;
