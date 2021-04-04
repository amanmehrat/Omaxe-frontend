import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import NoData from "../NoData";
import { LogException } from "../../utils/exception";
import TransactionGrid from "../grid/TransactionGrid";


import Loading from "../../components/Loading";

import { errorContext } from "../contexts/error/errorContext";
import { useGet, usePost } from "../../utils/hooks";


import axios from 'axios';
import config from '../../config';

const Transactions = () => {
    const history = useHistory();
    const billId = localStorage.getItem('billId');
    const flatId = localStorage.getItem('flatId');

    if (!billId) history.push("/billing/viewbills");

    const errorCtx = useContext(errorContext);
    //if (!selectedProjectId) history.push("/projects");

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
                    <Link to={'/Receipts/' + billId + '/' + flatId} className="project__header--filter--button">Downloads</Link>
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
