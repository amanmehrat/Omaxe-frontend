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

const FlatsModels = () => {
    const history = useHistory();
    return [
        {
            Header: 'Property No.',
            accessor: 'flatNumber',
            disableSortBy: true
        },
        {
            Header: 'Owner',
            accessor: 'ownerName',
            disableSortBy: true
        },
        {
            Header: 'Block Incharge',
            accessor: 'blockIncharge',
            disableSortBy: true
        },
        {
            Header: 'Block Number',
            accessor: 'blockNumber',
            disableFilters: true,
            disableSortBy: true
        },
        {
            Header: 'floor Number',
            accessor: 'floorNumber',
            disableFilters: true,
            disableSortBy: true
        },
        {
            Header: 'Property',
            accessor: 'propertyType',
            disableSortBy: true
        },
        {
            Header: 'Edit',
            accessor: 'edit',
            Cell: ({ row }) => (
                <LightTooltip title="Edit Property">
                    <IconButton aria-label="Edit Property"
                        onClick={(e) => { e.stopPropagation(); history.push('/flat/edit/' + row.original.id); }}
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
export default FlatsModels;