
const CamColModels = () => [
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
        disableFilters: true
    }
]

export default CamColModels;