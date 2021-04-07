import React from 'react';

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

const Spinner = ({ SpinnerText }) => {
    const classes = useStyles();
    return (
        <div className={classes.spinnerdiv}>
            <img src={spinner} className={classes.spinnerImg} />
            <div className={classes.spinnerText}>{SpinnerText}</div>
        </div>
    );
}

export default Spinner;