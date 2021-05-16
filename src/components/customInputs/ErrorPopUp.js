import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import parse from 'html-react-parser';
import spinner from '../../img/spinner.gif';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        color: '#637390',
        transform: `translate(-${top}%, -${left}%)`,
    };
}
const useStyles = makeStyles((theme) => ({
    success: {
        marginTop: '8px',
        maxHeight: '282px',
        overflow: 'scroll',
    },
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        color: 'green',
        textAlign: 'center',
        fontSize: '12px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 1, 3),
        minWidth: '50%'
    },
    modalHeading: {
        textAlign: 'center'
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
        textAlign: 'center',
    },
    exportInput: {
        textAlign: 'center',
    },
    spinnerdiv: {
        marginTop: '5%',
    },

}));

const ErrorPopUp = ({ open, handleClose, data, loading, setLoading, loadingMessage, successMessage }) => {
    const [success, setSuccess] = useState(null);

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    useEffect(() => {
        setSuccess(data);
    }, [data])

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title" className={classes.modalHeading}>{loading == true ? loadingMessage : successMessage}</h2>
            <div id="simple-modal-description" className={classes.exportInput}>
                {success &&
                    <>
                        <div className={classes.success}>
                            {parse(success)}
                        </div>
                        <div className={classes.downloadBtnDiv}>
                            <button onClick={(e) => console.log(e)} className={classes.downloadBtn} >Copy</button>
                            <button onClick={(e) => handleClose()} className={classes.downloadBtn} >Cancel</button>
                        </div>
                    </>
                }
            </div>
            {loading &&
                <div className={classes.spinnerdiv}>
                    <img src={spinner} className={classes.spinnerImg} />
                    <div className={classes.spinnerText}>Sending....</div>
                </div>
            }
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

export default ErrorPopUp;