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