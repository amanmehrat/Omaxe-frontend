import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Spinner from '../Spinner';
import { usePut } from "../../utils/hooks";
import { LogException } from "../../utils/exception";
import AuthContext from "../contexts/Auth";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        color: '#637390',
        transform: `translate(-${top}%, -${left}%)`,
        fontSize: `18px`
    };
}
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
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        //border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    modalHeading: {
        textAlign: 'center'
    },
    remarks: {
        width: '100%',
        margin: '10px 5px',
        border: '2px solid gray',
        borderRadius: '0.9rem',
        height: '124px',
        padding: '10px'
    },
    downloadBtn: {
        backgroundColor: '#637390',
        border: 'none',
        color: 'white',
        padding: '8px 21px',
        textDecoration: 'none',
        fontSize: '12px',
        margin: '2px',
        cursor: 'pointer',
        borderRadius: '10px',
        outline: 'none'
    },
    downloadBtnDiv: {
        textAlign: 'center'
    },
    selectDropdown: {
        height: '3.5rem',
        color: '#495057',
        border: '1px solid #ced4da',
        outline: 'none',
        fontSize: '14px',
        padding: '5px',
        borderRadius: '0.9rem',
        width: '100%',
        margin: '10px 5px',
    },
    selectInputDiv: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'

    },
}));

const AddPayment = ({ open, setImportOpen, billId, paidFor, setLoadViewBills }) => {

    const { user } = useContext(AuthContext);
    const [amount, setAmount] = useState(null);
    const [paidVia, setPaidVia] = useState(-1);
    const [remarks, setRemarks] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { run: updatePayment } = usePut("/billing/updatePayment",
        null,
        {
            onResolve: (data) => {
                if (data?.transactionDetails?.transactionId) {
                    setSuccess("Payment Updated successfully. \r\n Your Receipt no. is " + data?.transactionDetails?.receiptNumber);
                    setAmount(null);
                    setPaidVia(-1);
                    setRemarks(null);
                    setLoadViewBills(true);
                } else {
                    setError(data?.transactionDetails?.message + ". Please contact Administrator.");
                    LogException("Unable To Generate Bill", data?.transactionDetails?.message);
                }
                setLoading(false);
            },
            onReject: (err) => {
                setLoading(false);
                LogException("Unable To Generate Bill", err);
                setError("Unable to Update payment, Please contact Administrator.");
            }
        });

    const addPayment = (event) => {
        event.stopPropagation();
        setSuccess("");
        setError("")
        if (paidVia == "-1") {
            setError("Please Choose Paid Via Option");
        } else if (amount == null || amount == 0) {
            setError("Please Enter Amount");
        } else if (remarks == null || remarks.trim() == "") {
            setError("Please Choose Remarks");
        } else {
            setLoading(true);
            let paymentObject = { billId, paidFor: parseInt(paidFor), amountReceived: parseInt(amount), paidVia: parseInt(paidVia), remarks, createdBy: user.id }
            updatePayment(paymentObject);
        }
    };

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title" className={classes.modalHeading}>Update Payment</h2>
            {success && <div className={classes.success}>{success}</div>}
            {error && <div className={classes.error}>{error}</div>}
            { !loading &&
                <div id="simple-modal-description" className={classes.exportInput}>
                    <div className={classes.selectInputDiv}>
                        <select onChange={(e) => setPaidVia(e.target.value)} className={classes.selectDropdown}>
                            <option value="-1">Choose Payment Mode</option>
                            <option value="0">Credit Card</option>
                            <option value="1">Debit Card</option>
                            <option value="2">Net Banking</option>
                            <option value="3">UPI</option>
                            <option value="4">CHEQUE</option>
                            <option value="4">Cash</option>
                            <option value="4">E-Wallet</option>
                        </select>
                    </div>
                    <div className="row">
                        <div className="form-group wid100">
                            <input
                                name="amount"
                                type="number"
                                autoComplete="off"
                                placeholder="Amount"
                                className="input-text wid100 bd-rad"
                                onChange={(e) => { setAmount(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <textarea className={classes.remarks} onChange={(e) => setRemarks(e.target.value)} placeholder={"Enter Remarks"}></textarea>
                    </div>
                    <div className={classes.downloadBtnDiv}>
                        <button onClick={(e) => addPayment(e)} className={classes.downloadBtn} >Update Payment</button>
                    </div>
                </div>
            }
            {loading && <Spinner SpinnerText={"Waiting..."} />}
        </div>
    );

    return (
        <Modal
            open={open}
            onClose={() => setImportOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    );
}

export default AddPayment;