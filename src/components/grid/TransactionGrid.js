import React from 'react'
import TransactionsModels from './colmodels/TransactionsModels';
import Table from './table/Table';

const TransactionGrid = ({ transactions }) => {
    let models = TransactionsModels;
    transactions = transactions.map(item => {
        console.log(item.isSuccessful);
        item.paidOn = new Date(item.paidOn).toISOString().split('T')[0];
        //valuesitem.isSuccessful = ;
        return item;
    })

    const columns = React.useMemo(() => [...models()], []);
    const data = React.useMemo(() => transactions, [transactions]);
    return (
        <>
            <Table
                columns={columns}
                data={data}
                hiddenColumns={[]}
            />
        </>
    )
}

export default TransactionGrid;
