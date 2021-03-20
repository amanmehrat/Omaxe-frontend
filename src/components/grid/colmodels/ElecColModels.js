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

const ElecColModels = () => (setSelectedBillId, setImportOpen) => [
    {
        Header: 'Flat No',
        accessor: 'flatNo'
    },
    {
        Header: 'Bill Number',
        accessor: 'billNumber'
    },
    {
        Header: 'Amount',
        accessor: 'amount',
        disableFilters: true
    },
    {
        Header: 'Due Amount',
        accessor: 'dueAmount',
        disableFilters: true
    },
    {
        Header: 'Amount To Be Paid',
        accessor: 'amountToBePaid',
        disableFilters: true
    },
    {
        Header: 'Receipt Number',
        accessor: 'receiptNumber'
    },
    {
        Header: 'Amount Received',
        accessor: 'amountReceived',
        disableFilters: true
    },
    {
        Header: 'Paid Via',
        accessor: 'paidVia',
        disableFilters: true
    },
    {
        Header: 'Paid On',
        accessor: 'paidOn',
        width: '100',
        disableFilters: true
    },
    {
        Header: 'Payment',
        accessor: 'id',
        Cell: ({ row }) => (
            <div>
                <LightTooltip title="Update Payment">
                    <IconButton aria-label="Update Payment" onClick={() => { setImportOpen(true); console.log("----", row.original.id); setSelectedBillId(row.original.id); }} >
                        <BorderColorOutlinedIcon />
                    </IconButton>
                </LightTooltip>
            </div >
        ),
        disableFilters: true
    }
]

export default ElecColModels;