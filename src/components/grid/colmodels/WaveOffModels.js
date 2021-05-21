import { Link } from 'react-router-dom';
const WaveOffModels = () => [
    {
        Header: 'Property No',
        accessor: 'flat.flatNumber',
        disableSortBy: true

    },
    {
        Header: 'Owner',
        accessor: 'flat.ownerName',
        disableSortBy: true
    },
    {
        Header: 'Bill Type',
        accessor: 'billType',
        disableSortBy: true
    },
    {
        Header: 'Amount',
        accessor: 'amount',
        disableFilters: true
    },
    {
        Header: 'Updated By',
        accessor: 'user.name',
        disableFilters: true,
        disableSortBy: true
    },
    {
        Header: 'Updated On',
        accessor: 'createdAt',
        disableFilters: true,
        disableSortBy: true
    },

    {
        Header: 'Document',
        accessor: 'transactionId',
        Cell: ({ row }) => <a target="_blank" href={row.original.docUrl}>View Document</a>,
        disableFilters: true,
        disableSortBy: true
    },
]

export default WaveOffModels;