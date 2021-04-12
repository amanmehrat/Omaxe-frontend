import React, { useContext } from 'react'
import ProjectsModels from './colmodels/ProjectsModels';
import Table from './table/Table';
import { useHistory } from 'react-router-dom';
import AuthContext from "../contexts/Auth";

const ProjectGrid = ({ projects }) => {
    const history = useHistory();
    let models = ProjectsModels;
    const columns = [...models()]
    const data = React.useMemo(() => projects, [projects]);
    const { user } = useContext(AuthContext);
    return (
        <>
            <Table
                columns={columns}
                data={data}
                onHandleRowClick={id => { history.push("/project/" + id) }}
                hiddenColumns={(user && user.role == "admin") ? [] : ["Payment", "Edit"]}
            />
        </>
    )
}
export default ProjectGrid;
