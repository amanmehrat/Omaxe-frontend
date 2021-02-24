import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import spinner from '../img/spinner.gif';

const useStyles = makeStyles((theme) => ({
    spinnerdiv: {
        marginTop: '5%',
        marginLeft: '40%'
    },
    spinnerImg: {
    },
    spinnerText: {
    }
}));

const Spinner = () => {
    const classes = useStyles();
    return (
        <div className={classes.spinnerdiv}>
            <img src={spinner} className={classes.spinnerImg} />
            <div className={classes.spinnerText}>Loading...</div>
        </div>
    );
}

export default Spinner;