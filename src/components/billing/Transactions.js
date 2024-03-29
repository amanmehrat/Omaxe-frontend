import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import NoData from "../NoData";
import { LogException } from "../../utils/exception";
import { useGet } from "../../utils/hooks";

import TransactionGrid from "../grid/TransactionGrid";
import Loading from "../../components/Loading";


const Transactions = () => {
    const history = useHistory();
    const billId = localStorage.getItem('billId');
    const flatId = localStorage.getItem('flatId');

    if (!billId) history.push("/billing/viewbills");

    const [loading, setLoading] = useState(false)
    const [transactions, setTransactions] = useState(null);

    const { run: getTransactions } = useGet("/billing/getTransactions/" + billId, null,
        {
            onResolve: (data) => {
                if (data?.transactionsData) {
                    setTransactions(data.transactionsData);
                } else {
                    //errorCtx.setError("Unable To fetch Transactions");
                    setTransactions([]);
                    LogException("Unable To fetch Transactions", data);
                }
                setLoading(false);
            },
            onReject: (err) => {
                LogException("Unable To fetch Transactions", err);
            }
        });


    useEffect(() => {
        if (billId) {
            getTransactions();
        }
    }, [billId]);


    const renderTransactions = () => {
        if (loading) {
            return <Loading />
        } if (transactions == null) {
            return "";
        } else if (transactions && transactions.length > 0) {
            return <TransactionGrid transactions={transactions} />
        } else {
            return <NoData text="No Transactions Found" />;
        }
    }
    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">Transactions</div>
                <div className="project__header--filter">
                    <Link to='/billing/viewbills' className="project__header--filter--button">View Bills</Link>
                    {(transactions && transactions.length > 0) && <Link target="_blank" to={'/Receipts/' + billId + '/' + flatId} className="project__header--filter--button">Download Receipts</Link>}
                </div>
            </div>

            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        {loading ? <Loading /> : renderTransactions()}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Transactions;
