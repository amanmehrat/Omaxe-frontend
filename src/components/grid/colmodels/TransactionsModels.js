
const TransactionsModels = () => [
    {
        Header: 'Receipt Number',
        accessor: 'receiptNumber',
        disableSortBy: true
    },
    {
        Header: 'Paid Via',
        accessor: 'paidVia',
        disableSortBy: true
    },
    {
        Header: 'Amount Paid',
        accessor: 'amountReceived',
        disableFilters: true
    },
    {
        Header: 'Paid On',
        accessor: 'paidOn',
        disableFilters: true,
        disableSortBy: true
    },
    {
        Header: 'CreatedBy',
        accessor: 'createdBy',
        disableFilters: true,
        disableSortBy: true
    },
    {
        Header: 'Remarks',
        accessor: 'remarks',
        disableFilters: true,
        disableSortBy: true
    }
]

export default TransactionsModels;