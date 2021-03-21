import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import NoData from "../NoData";
import { LogException } from "../../utils/exception";
import TransactionGrid from "../grid/TransactionGrid";


import Loading from "../../components/Loading";

import { errorContext } from "../contexts/error/errorContext";
import { useGet, usePost } from "../../utils/hooks";


const useStyles = makeStyles((theme) => ({
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: '12px',
        marginTop: '5px'
    },
    success: {
        color: 'green',
        textAlign: 'center',
        fontSize: '12px',
        marginTop: '5px'
    },
    selectDropdown: {
        color: '#495057',
        border: '1px solid #ced4da',
        outline: 'none',
        fontSize: '14px',
        padding: '10px',
        borderRadius: '100px',
        marginTop: '5px'
    },
    selectInputDiv: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'

    },
    formHeading: {
        color: '#495057',
        textAlign: 'center',
        fontSize: '2.5rem'
    },
    form: {
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        padding: '1.3rem',
        marginBottom: '2rem'
    },
    radioGroup: {
        justifyContent: 'center',
        fontSize: '1.7rem',
        alignItems: 'center'
    },
    editBTN: {
        border: 'none',
        background: 'white',
        outline: 'none'
    }

}));

const Transactions = () => {
    const history = useHistory();
    const billId = localStorage.getItem('billId');
    console.log("billId", localStorage.getItem('billId'));
    if (!billId) history.push("/billing/viewbills");

    const classes = useStyles();
    const errorCtx = useContext(errorContext);
    //if (!selectedProjectId) history.push("/projects");

    const [loading, setLoading] = useState(false)
    const [transactions, setTransactions] = useState(null);

    const { run: getTransactions } = useGet("/billing/getTransactions/" + billId, null,
        {
            onResolve: (data) => {
                console.log("data", data);
                if (data?.transactionsData) {
                    setTransactions(data.transactionsData);
                } else {
                    errorCtx.setError("Unable To fetch Transactions");
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
