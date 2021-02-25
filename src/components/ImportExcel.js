import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Spinner from './Spinner';
import FileUploader from './customInputs/FileUploader';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Link } from 'react-router-dom';
import { useGet, usePost } from "../utils/hooks";

import axios from 'axios';
import config from '../config';
import { FormatAlignJustify } from '@material-ui/icons';

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

const ImportExcel = ({ open, handleClose, projectId, setLoadFlats }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedFile, setSelectedFile] = useState(null);
    const [csvType, setCsvType] = useState(-1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleDateChange = (date) => setSelectedDate(date);
    const onSelectFile = (event) => {
        console.log("vent.target.files", event.target.files[0]);
        setSelectedFile(event.target.files[0]);
    }

    const importExcel = (event) => {
        event.stopPropagation();
        setSuccess("");
        setError("");

        let dateString = new Date(selectedDate);
        const month = dateString.getMonth() + 1;
        const year = dateString.getFullYear();

        let formData = new FormData();
        formData.append("csv", selectedFile);
        formData.append("projectId", projectId);
        formData.append("month", month);
        formData.append("year", year);
        formData.append("csvType", csvType);
        console.log(formData);
        if (csvType == "-1") {
            setError("Please Choose Billing Type");
        } else if (!selectedFile) {
            setError("Please Choose File");
        } else {
            setLoading(true);
            axios.post(`${config.restApiBase}/projects/importCSV`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            ).then(response => {
                console.log("Response", response);
                setLoading(false);
                let { data } = response;
                if (!(data && data.meta))
                    setError("Unable to import excel");
                if (data.meta.code >= 200 && data.meta.code < 300) {
                    setSelectedDate(new Date());
                    setSelectedFile(null);
                    setCsvType(-1)
                    setSuccess("Import Successfully");
                    setLoadFlats(true);
                } else {
                    setError("Unable to import excel");
                }
            }).catch((error) => {
                setError("Unable to import excel");
                console.log(error);
            });
        }
    };

    //console.log("props", props);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title" className={classes.modalHeading}>Import Excel</h2>
            {success && <div className={classes.success}>{success}</div>}
            {error && <div className={classes.error}>{error}</div>}
            { !loading &&
                <div id="simple-modal-description" className={classes.exportInput}>
                    <div className={classes.selectInputDiv}>
                        <select onChange={(e) => setCsvType(e.target.value)} className={classes.selectDropdown}>
                            <option value="-1">Choose Billing</option>
                            <option value="0">CAM Billling</option>
                            <option value="1">Electricity Billling</option>
                        </select>
                    </div>
                    <div>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                format="MMM-yyyy"
                                views={["year", "month"]}
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
                    <FileUploader
                        selectedFile={selectedFile}
                        onSelectFile={onSelectFile}
                    />
                    <div className={classes.downloadBtnDiv}>
                        <button onClick={(e) => importExcel(e)} className={classes.downloadBtn} >Upload</button>
                    </div>
                </div>
            }
            {loading && <Spinner />}
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

export default ImportExcel;