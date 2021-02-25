import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    customFile: {
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        height: 'calc(1.5em + .75rem + 2px)',
        marginBottom: '0'
    },
    customFileInput: {
        position: 'relative',
        zIndex: '2',
        width: '100%',
        height: 'calc(1.5em + .75rem + 2px)',
        margin: '0',
        opacity: '0'
    },
    customSelectedFile: {
        textAlign: 'center',
        color: '#495057',
        fontSize: '16px',
        marginBottom: '10px'
    },
    customFileLabel: {
        position: 'absolute',
        top: '0',
        right: '0',
        left: '0',
        zIndex: '1',
        height: 'calc(1.5em + .75rem + 2px)',
        padding: '.375rem .75rem',
        fontWeight: '400',
        lineHeight: '1.5',
        color: '#495057',
        backgroundColor: '#fff',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        "&::after": {
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            zIndex: '3',
            display: 'block',
            height: 'calc(1.5em + .75rem)',
            padding: '.375rem .75rem',
            lineHeight: '1.5',
            color: '#495057',
            content: '"Browse"',
            backgroundColor: '#e9ecef',
            borderLeft: 'inherit',
            borderRadius: '0 .25rem .25rem 0'
        }
    }
}));

const FileUploader = ({ onSelectFile, selectedFile }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.customFile}>
                <input type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    id="customFile"
                    className={classes.customFileInput}
                    onChange={onSelectFile}
                />
                <label
                    className={classes.customFileLabel}
                    for="customFile"
                >
                    Choose file
                        </label>
            </div>
            <div className={classes.customSelectedFile}>{selectedFile?.name}</div>
        </>
    );
}

export default FileUploader;