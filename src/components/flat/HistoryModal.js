import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Spinner from '../Spinner';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';


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
    exportInput: {
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
        borderRadius: '.25rem',
        width: '100%',
        marginTop: '5px'
    },
    selectInputDiv: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'

    },
}));

const HistoryModal = ({ open, handlePopUpClose, flatId, popUpFor, setLoadElectricity, setLoadCam, setRequest }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fetchBy, setFetchBy] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleDateChange = (date) => setSelectedDate(date);

    const GenerateHistory = (event) => {
        event.stopPropagation();
        setLoading(true);
        setSuccess("");
        setError("");

        let dateString = new Date(selectedDate);
        const month = dateString.getMonth() + 1;
        const year = dateString.getFullYear();

        if (fetchBy == 1) {
            setRequest({
                flatId: flatId,
                fetchBy: 1,
                fetchData: {
                    month: month,
                    year: year
                }
            });
        }
        else if (fetchBy == 2) {
            setRequest({
                flatId: flatId,
                fetchBy: 2,
                fetchData: {
                    year: year
                }
            });
        }
        else {
            setRequest({
                flatId: flatId,
                fetchBy: 0
            });
        }
        if (popUpFor == "Cam") {
            setLoadCam(true);
        } else if (popUpFor == "Electricity") {
            setLoadElectricity(true);
        }
        handlePopUpClose();
        setLoading(false);
    };

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title" className={classes.modalHeading}>View {popUpFor} History</h2>
            {success && <div className={classes.success}>{success}</div>}
            {error && <div className={classes.error}>{error}</div>}
            { !loading &&
                <div id="simple-modal-description" className={classes.exportInput}>
                    <div className={classes.selectInputDiv}>
                        <select onChange={(e) => setFetchBy(e.target.value)} className={classes.selectDropdown}>
                            <option value="0">Complete History</option>
                            <option value="1">Month Wise</option>
                            <option value="2">Year Wise</option>
                        </select>
                    </div>
                    <div>
                        {fetchBy == 1 &&
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    variant="inline"
                                    format="MMM-yyyy"
                                    views={["month", "year"]}
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Choose Month-Year"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date"
                                    }}
                                    autoOk
                                />
                            </MuiPickersUtilsProvider>
                        }
                        {fetchBy == 2 &&
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    variant="inline"
                                    format="yyyy"
                                    views={["year"]}
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Choose Year"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date"
                                    }}
                                    autoOk
                                />
                            </MuiPickersUtilsProvider>
                        }
                    </div>

                    <div className={classes.downloadBtnDiv}>
                        <button onClick={(e) => GenerateHistory(e)} className={classes.downloadBtn} >View history</button>
                    </div>
                </div>
            }
            {loading && <Spinner SpinnerText={"Loading..."} />}
        </div>
    );

    return (
        <Modal
            open={open}
            onClose={handlePopUpClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    );
}

export default HistoryModal;