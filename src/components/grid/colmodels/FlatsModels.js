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

const FlatsModels = () => {
    const history = useHistory();
    return [
        {
            Header: 'Property No.',
            accessor: 'flatNumber',
        },
        {
            Header: 'owner',
            accessor: 'ownerName',
        },
        {
            Header: 'resident',
            accessor: 'residentName',
        },
        {
            Header: 'Block Number',
            accessor: 'blockNumber',
            disableFilters: true
        },
        {
            Header: 'floor Number',
            accessor: 'floorNumber',
            disableFilters: true
        },
        {
            Header: 'Property',
            accessor: 'propertyType',
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
            disableFilters: true

        }
    ]
}
export default FlatsModels;