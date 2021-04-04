import React, { useState } from 'react'
import TransactionsModels from './colmodels/TransactionsModels';
import Table from './table/Table';
import PaidVia from '../../utils/PaidViaSet';

const TransactionGrid = ({ transactions }) => {
    let models = TransactionsModels;
    transactions = transactions.map(item => { item.paidVia = PaidVia.get(item.paidVia); return item; })
    transactions = transactions.map(item => { item.paidOn = new Date(item.paidOn).toISOString().split('T')[0]; return item; })

    const columns = React.useMemo(
        () => [
            ...models()
        ],
        []
    );
    const data = React.useMemo(() => transactions, [transactions]);
    return (
        <>
            <Table
                columns={columns}
                data={data}
            />
        </>
    )
}

export default TransactionGrid;
