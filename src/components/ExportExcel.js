import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Spinner from './Spinner';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';

import axios from 'axios';
import config from '../config';

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
    }
}));

const ExportExcel = ({ open, handleClose, projectId }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const exportExcel = (event) => {

        var dateString = new Date(selectedDate);
        const month = dateString.getMonth() + 1;
        const year = dateString.getFullYear();

        const requestObject = {
            projectId: projectId,
            month: month,
            year: year
        }

        event.stopPropagation();
        setLoading(true);
        axios.post(`${config.restApiBase}/projects/exportCSV`,
            requestObject
        ).then(response => {
            setLoading(false);
            let { data } = response;
            if (data && data.meta) {
                setError("Unable To Download Excel. Please Contact To Tech-Team");
            } else {
                setError("");
                handleClose();
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Project-${month}-${year}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }).catch((error) => {
            setLoading(false);
            setError("Unable To Download Excel. Please Contact To Tech-Team");
        });
    };

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title" className={classes.modalHeading}>Export Excel</h2>
            {error && <div className={classes.error}>{error}</div>}
            { !loading &&
                <div id="simple-modal-description" className={classes.exportInput}>
                    <div>
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
                    </div>
                    <div className={classes.downloadBtnDiv}>
                        <button onClick={(e) => exportExcel(e)} className={classes.downloadBtn} >Download</button>
                    </div>
                </div>
            }
            { loading && <Spinner SpinnerText={"Downloading..."} />}
        </div>
    );

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    );
}

export default ExportExcel;