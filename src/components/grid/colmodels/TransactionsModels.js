
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
    },
    {
        Header: 'status',
        accessor: 'isSuccessful',
        Cell: ({ row }) => {
            if (row.original.isSuccessful == null || row.original.isSuccessful == true) {
                return <b><span style={{ color: "green" }}>{"Successful"}</span></b>;
            }
            else return <b><span style={{ color: "red" }}>{"UnSuccessful"}</span></b>;
        },
        disableFilters: true,
        disableSortBy: true
    }
]

export default TransactionsModels;