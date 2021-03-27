import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
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
            width: 50000
        },
        {
            Header: 'Started On',
            accessor: 'startedOn',
            disableFilters: true
        },
        {
            Header: 'Address',
            accessor: 'address',
            disableFilters: true
        },
        {
            Header: 'Total Units',
            accessor: 'totalUnits',
            disableFilters: true
        },
        {
            Header: 'Edit',
            accessor: 'edit',
            Cell: ({ row }) => (
                <LightTooltip title="Edit Project">
                    <IconButton aria-label="Edit Project"
                        onClick={(e) => { e.stopPropagation(); history.push('/project/edit/' + row.original.id); }}
                    >
                        <BorderColorOutlinedIcon />
                    </IconButton>
                </LightTooltip>
            ),
            disableFilters: true

        }
    ]
}
export default ProjectsModels;