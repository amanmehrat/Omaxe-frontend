import React, { useState } from 'react'
import ProjectsModels from './colmodels/ProjectsModels';
import Table from './table/Table';
import { useHistory } from 'react-router-dom';

const ProjectGrid = ({ projects }) => {
    const history = useHistory();
    let models = ProjectsModels;
    const columns = [...models()]
    const data = React.useMemo(() => projects, [projects]);
    return (
        <>
            <Table
                columns={columns}
                data={data}
                onHandleRowClick={id => { history.push("/project/" + id) }}
            />
        </>
    )
}
export default ProjectGrid;
