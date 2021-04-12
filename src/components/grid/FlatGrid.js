import React, { useContext } from 'react'
import FlatsModels from './colmodels/FlatsModels';
import Table from './table/Table';
import { useHistory } from 'react-router-dom';
import AuthContext from "../contexts/Auth";

const FlatGrid = ({ flats }) => {
    const history = useHistory();
    let models = FlatsModels;
    const columns = [...models()]
    const data = React.useMemo(() => flats, [flats]);
    const { user } = useContext(AuthContext);
    return (
        <>
            <Table
                columns={columns}
                data={data}
                onHandleRowClick={id => { history.push("/flats/" + id) }}
                hiddenColumns={(user && user.role == "admin") ? [] : ["Payment", "Edit"]}
            />
        </>
    )
}
export default FlatGrid;
