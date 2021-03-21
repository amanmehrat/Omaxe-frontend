
const TransactionsModels = () => [
    {
        Header: 'Receipt Number',
        accessor: 'receiptNumber'
    },
    {
        Header: 'Paid Via',
        accessor: 'paidVia'
    },
    {
        Header: 'Amount Paid',
        accessor: 'amountReceived',
        disableFilters: true
    },
    {
        Header: 'Paid On',
        accessor: 'paidOn',
        disableFilters: true
    },
    {
        Header: 'CreatedBy',
        accessor: 'createdBy',
        disableFilters: true
    },
    {
        Header: 'Remarks',
        accessor: 'remarks',
        disableFilters: true
    }
]

export default TransactionsModels;