import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import { Tooltip, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

const ProjectsModels = () => {
    const history = useHistory();
    return [
        {
            Header: 'Project Name',
            accessor: 'name',
            width: 50000,
            disableSortBy: true
        },
        {
            Header: 'Started On',
            accessor: 'startedOn',
            disableFilters: true,
            disableSortBy: true
        },
        {
            Header: 'Address',
            accessor: 'address',
            disableFilters: true,
            disableSortBy: true
        },
        {
            Header: 'Total Units',
            accessor: 'totalUnits',
            disableFilters: true,
            disableSortBy: true
        },
        {
            Header: 'Edit',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <LightTooltip title="Edit Project">
                    <IconButton aria-label="Edit Project"
                        onClick={(e) => { e.stopPropagation(); history.push('/project/edit/' + row.original.id); }}
                    >
                        <BorderColorOutlinedIcon />
                    </IconButton>
                </LightTooltip>
            ),
            disableFilters: true,
            disableSortBy: true

        }
    ]
}
export default ProjectsModels;