import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogException } from "../../utils/exception";
import Loading from "../../components/Loading";
import AuthContext from "../contexts/Auth";
import { usePost } from "../../utils/hooks";
import cm from "classnames";

const useStyles = makeStyles((theme) => ({
    groups: {
        display: 'inline-block',
    },
    dropdownDiv: {
        display: 'inline-flex',
        flexDirection: 'column',
        float: 'left',
        width: '35%',
        padding: '1.25rem'
    },
    selectInputDiv: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    formBorder: {
        border: '1px solid rgba(211,211,211,0.3)',
        padding: '12px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: "center"
    },
    btnGroups: {
        width: '22%',
        display: 'inline-flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem'
    },
    autocomplete: {
        width: '35%',
        padding: '1.1rem'
    },
    amountDiv: {
        display: 'flex',
        flexDirection: 'column',
        width: '20%',
        padding: '1.1rem'
    },
}));
const ChequeBounce = () => {
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [receiptNo, setReceiptNo] = useState("")
    const [chequeNo, setChequeNo] = useState("")
    const [notification, setNotification] = useState(-1)
    const [chequeError, setChequeError] = useState("");

    const { user } = useContext(AuthContext);

    const validateWaveOff = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setSuccess("");
        setError("");
        if (receiptNo == "") {
            setError("Please provide Receipt no.");
        } else if (chequeNo == "") {
            setError("Please provide Cheque no.");
        } else if (chequeNo.length != 5) {
            setError("Please provide Valid Cheque no.");
        } else {
            addChequeBouncePenality();
        }
    }

    const { run: chequeBounceEntry } = usePost("/billing/chequeBounceEntry",
        null,
        {
            onResolve: (data) => {
                if (data != null && data?.error != null) {
                    setError(data.error);
                } else if (data != null && data.message != undefined) {
                    setSuccess(data.error);
                }
                setLoading(false);
            },
            onReject: (err) => {
                setError(JSON.stringify(err));
                setLoading(false);
                LogException("Unable To Generate Bill", err);
            }
        });

    const addChequeBouncePenality = () => {
        let bounceObject = {
            receiptNo: receiptNo,
            chequeNo: chequeNo,
            sendNotification: notification,
            updatedBy: user.id
        }
        chequeBounceEntry(bounceObject);
    };
    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">Cheque Bounce Entry</div>
                <div className="project__header--filter">
                    <Link to='/billing/viewbills' className="project__header--filter--button">View Bills</Link>
                </div>
            </div>
            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        <form className={cm(classes.formBorder, "ProjectForm")} onSubmit={e => validateWaveOff(e)}>
                            <div className={cm(classes.autocomplete, "")}>
                                <input
                                    placeholder="Receipt No."
                                    className="input-text wid100"
                                    onChange={event => setReceiptNo(event.target.value)}
                                />
                            </div>
                            <div className={cm(classes.dropdownDiv)}>
                                <input
                                    placeholder="Cheque No."
                                    className="input-text wid100"
                                    onChange={event => setChequeNo(event.target.value)}
                                />
                                <div className="success">{chequeError}</div>
                            </div>
                            <div className={cm(classes.amountDiv, "")}>
                                <label className={cm(classes.CheckBox, "form-check-label")} style={{ wordWrap: 'break-word', fontSize: '1.6rem' }}>
                                    <input type="checkbox" onChange={(e) => e.target.checked ? setNotification(true) : setNotification(false)} style={{ verticalAlign: 'middle', marginRight: '0.26rem' }} />
                                    Send Notification
                                </label>
                            </div>
                            <div className={classes.btnGroups}>
                                <button className={cm("project__header--filter--button materialBtn")} type="submit">
                                    Add Penality
                                </button>
                            </div>
                        </form>
                        {error && <div className="error">{error}</div>}
                        {success && <div className="success">{success}</div>}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ChequeBounce;
