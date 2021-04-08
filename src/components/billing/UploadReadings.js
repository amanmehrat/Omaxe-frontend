import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import cm from "classnames";
import parse from 'html-react-parser';
import Loading from "../../components/Loading";
import FileUploader from '../customInputs/FileUploader';
import { LogException } from "../../utils/exception";
import { useProjectContext } from "../contexts/Project";
import axios from 'axios';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    groups: {
        display: 'inline-block',
    },
    dropdownDiv: {
        display: 'inline-flex',
        flexDirection: 'column',
        float: 'left',
        width: '28%'
    },
    selectDropdown: {
        color: '#495057',
        border: '1px solid #ced4da',
        outline: 'none',
        fontSize: '14px',
        padding: '7px',
        borderRadius: '100px',
        marginTop: '11px',
        width: '80%'
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
        alignItems: 'center'
    },
    btnGroups: {
        width: '25%',
        display: 'inline-flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },
    fileUploader: {
        display: 'flex',
        flexDirection: 'column',
        width: '28%',
        padding: '1.1rem'
    },
    newCustom: {
        marginTop: '12px',
        fontSize: '1.5rem',
    }
}));

const UploadReadings = () => {

    const classes = useStyles();
    const history = useHistory();

    const { selectedProjectId } = useProjectContext();
    if (!selectedProjectId) history.push("/projects");
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("")

    const onSelectFile = (event) => {
        setFile(event.target.files[0]);
    }
    const validateReadings = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setSuccess("");
        setError("");
        if (!file) {
            setError("Please Choose File");
        } else {
            addUploadReadings();
        }
    }
    const addUploadReadings = () => {
        let formData = new FormData();
        formData.append("csv", file);
        formData.append("projectId", selectedProjectId);
        formData.append("month", (new Date(selectedMonth).getMonth() + 1).toString());
        formData.append("year", new Date(selectedYear).getFullYear().toString());
        setLoading(true);
        axios.post(`${config.restApiBase}/projects/updateReadings`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        ).then(response => {
            let { data } = response;
            data = data.data;
            console.log(data);
            if (data != null && data?.failedFlatsList != null && data?.failedFlatsList != undefined && data.failedFlatsList.length > 0) {
                let ErrorTable = "<table border='1' class='generateBillTable'><thead><tr><th>PropertyNo.</th><th>error</th><th>PropertyNo.</th><th>error</th><th>PropertyNo.</th><th>error</th></tr></thead><tbody>";
                let count = 0;
                data?.failedFlatsList.forEach(element => {
                    if (count == 0) ErrorTable += "<tr>";
                    ErrorTable += `<td><b>${element.flatNo}</b></td><td>${element.error}</td>`;
                    if (count == 2) { ErrorTable += "</tr>"; count = 0; } else { count++; }
                });
                ErrorTable += "</tbody></table>";
                setSuccess(ErrorTable);
                console.log("ErrorTable", ErrorTable);
            } else if (data != null && data.msg != undefined) {
                setSuccess(data.msg);
                console.log("data Message", data.msg);
            }
            console.log("Message", data);
            setLoading(false);
            //errorCtx.setSuccess("Bill Generated Successfully");
        }).catch((error) => {
            setLoading(false);
            setError("Unable to upload readings");
        });
    };

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">View Bills</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/billing/generateBills"} >Generate Bill</Link>
                </div>
            </div>
            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        <form className={cm(classes.formBorder, "ProjectForm")} onSubmit={e => validateReadings(e)}>
                            <div className={cm(classes.groups, "wid23")}>
                                <label className="input-label">Select Year</label>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardDatePicker
                                        className="input-text"
                                        variant="inline"
                                        format="YYYY"
                                        views={["year"]}
                                        margin="normal"
                                        id="date-picker-inline"
                                        name="year"
                                        value={selectedYear}
                                        onChange={date => { setSelectedYear(date); }}
                                        autoOk
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <div className={cm(classes.groups, "wid23")}>
                                <label className="input-label">Select Month</label>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardDatePicker
                                        className="input-text"
                                        variant="inline"
                                        format="MMM"
                                        views={["month"]}
                                        margin="normal"
                                        id="date-picker-inline"
                                        name="month"
                                        value={selectedMonth}
                                        onChange={date => { setSelectedMonth(date); }}
                                        autoOk
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <div className={cm(classes.fileUploader, "")}>
                                <label className="input-label">Document</label>
                                <FileUploader
                                    selectedFile={file}
                                    onSelectFile={onSelectFile}
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />
                            </div>
                            <div className={classes.btnGroups}>
                                <button className={cm("project__header--filter--button materialBtn")} type="submit">
                                    Upload Readings
                                </button>
                            </div>
                        </form>
                        {loading &&
                            <Loading />
                        }
                        {(success) &&
                            <>
                                <div className="error">{error}</div>
                                <div className="successBill">{parse(success)}</div>
                            </>
                        }
                        {(error && !success) &&
                            <div className="error">{error}</div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default UploadReadings;
