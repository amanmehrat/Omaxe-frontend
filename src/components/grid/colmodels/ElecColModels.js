import { Tooltip, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

const ElecColModels = (setSelectedBillId, setImportOpen, setSelectedFlatId) => [
    {
        Header: 'Property No',
        accessor: 'flat.flatNumber',
        disableSortBy: true
    },
    {
        Header: 'Bill Number',
        accessor: 'billNumber',
        disableSortBy: true
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
        accessor: 'receiptNumber',
        disableSortBy: true
    },
    {
        Header: 'Amount Received',
        accessor: 'amountReceived',
        disableFilters: true,
        disableSortBy: true
    },
    {
        Header: 'Paid Via',
        accessor: 'paidVia',
        disableFilters: true,
        disableSortBy: true
    },
    {
        Header: 'Paid On',
        accessor: 'paidOn',
        width: '100',
        disableFilters: true,
        disableSortBy: true
    },
    {
        Header: 'Payment',
        accessor: 'Payment',
        Cell: ({ row }) => (
            <div>
                <LightTooltip title="Update Payment">
                    <IconButton aria-label="Update Payment" onClick={() => { setImportOpen(true); setSelectedBillId(row.original.id); setSelectedFlatId(row.original.flatId); }} >
                        <MonetizationOnOutlinedIcon />
                    </IconButton>
                </LightTooltip>
            </div >
        ),
        disableFilters: true,
        disableSortBy: true
    },
    {
        Header: 'Transactions',
        accessor: 'transactionId',
        Cell: ({ row }) => (
            <Link
                to='/billing/transactions'
                onClick={() => { localStorage.setItem('billId', row.original.id); localStorage.setItem('flatId', row.original.flatId); }}
            >
                <LightTooltip title="View Transactions">
                    <IconButton aria-label="View Transactions">
                        <AccountBalanceOutlinedIcon />
                    </IconButton>
                </LightTooltip>
            </Link>
        ),
        disableFilters: true,
        disableSortBy: true
    }
]

export default ElecColModels;