
const ElecByIdModels = (setSelectedBillId, setImportOpen) => [
    {
        Header: 'Bill Number',
        accessor: 'billNumber',
        disableSortBy: true
    },
    {
        Header: 'Net Payable',
        accessor: 'netPayable',
        disableFilters: true
    },
    {
        Header: 'Amount To Be Paid',
        accessor: 'amountToBePaid',
        disableFilters: true
    },
    {
        Header: 'Amount Received',
        accessor: 'amountReceived',
        disableFilters: true
    },
    {
        Header: 'Due Amount',
        accessor: 'dueAmount',
        disableFilters: true
    },
    {
        Header: 'Receipt Number',
        accessor: 'receiptNumber'
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
        disableFilters: true,
        disableSortBy: true
    }
]

export default ElecByIdModels;