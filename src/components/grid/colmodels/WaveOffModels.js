import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import { Tooltip, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

const WaveOffModels = () => [
    {
        Header: 'Property No',
        accessor: 'flat.flatNumber'
    },
    {
        Header: 'Owner',
        accessor: 'flat.ownerName'
    },
    {
        Header: 'Bill Type',
        accessor: 'billType',
    },
    {
        Header: 'Amount',
        accessor: 'amount',
        disableFilters: true
    },
    {
        Header: 'Updated By',
        accessor: 'user.name',
        disableFilters: true
    },
    {
        Header: 'Updated On',
        accessor: 'createdAt',
        disableFilters: true
    },

    {
        Header: 'Document',
        accessor: 'transactionId',
        Cell: ({ row }) => <a target="_blank" href={row.original.docUrl}>View Document</a>,
        disableFilters: true
    },
]

export default WaveOffModels;