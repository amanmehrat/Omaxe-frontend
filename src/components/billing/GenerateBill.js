import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import parse from 'html-react-parser';
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import cm from "classnames";

import Loading from "../../components/Loading";

import { LogException } from "../../utils/exception";
//import './AddFlat.css'


import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MyTextInput from '../../components/customInputs/MyTextInput';

import { useProjectContext } from "../contexts/Project";
import AuthContext from "../contexts/Auth";
import { usePost } from "../../utils/hooks";


const useStyles = makeStyles((theme) => ({
    selectDropdown: {
        color: '#495057',
        border: '1px solid #ced4da',
        outline: 'none',
        fontSize: '14px',
        padding: '10px',
        borderRadius: '100px',
        marginTop: '5px'
    },
    selectInputDiv: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    remarks: {
        width: '100%',
        margin: '10px 5px',
        border: '2px solid gray',
        borderRadius: '0.9rem',
        height: '124px',
        padding: '10px'
    }
}));

const GenerateBill = () => {
    const BillStructure = {
        billType: -1,
        year: "",
        month: "",
        dueDate: "",
        projId: "",
        excludedFlats: "",
    }
    const classes = useStyles();
    const history = useHistory();

    const { user } = useContext(AuthContext);
    const { selectedProjectId } = useProjectContext();
    if (!selectedProjectId) history.push("/projects");


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const { run: generateBill } = usePost("/billing/generateBill",
        null,
        {
            onResolve: (data) => {
                if (data != null && data?.flatNo != null && data?.flatNo != undefined && data.flatNo.length > 0) {
                    let ErrorTable = "<table border='1' class='generateBillTable'><thead><tr><th>PropertyNo.</th><th>error</th><th>PropertyNo.</th><th>error</th><th>PropertyNo.</th><th>error</th></tr></thead><tbody>";
                    let count = 0;
                    data?.flatNo.forEach(element => {
                        if (count == 0) ErrorTable += "<tr>";
                        ErrorTable += `<td><b>${element.flatNumber}</b></td><td>${element.error}</td>`;
                        if (count == 2) { ErrorTable += "</tr>"; count = 0; } else { count++; }
                    });
                    ErrorTable += "</tbody></table>";
                    setSuccess(ErrorTable);
                } else if (data != null && data.message != undefined) {
                    setSuccess(data.message);
                }
                //errorCtx.setSuccess("Bill Generated Successfully");
                setLoading(false);
            },
            onReject: (err) => {
                setError(JSON.stringify(err));
                setLoading(false);
                LogException("Unable To Generate Bill", err);
                //errorCtx.setError(err);
            }
        });

    const SaveBill = (values, setSubmitting) => {
        setError("");
        setSuccess("");
        if (values.billType == "-1") {
            setError("Please Choose billType");
        } else {
            const yearString = new Date(selectedYear).getFullYear();
            const monthString = new Date(selectedMonth).getMonth() + 1;
            values.projId = selectedProjectId;
            values.year = yearString.toString();
            values.month = monthString.toString();
            //values.createdBy = user.id;
            values.dueDate = values.dueDate.toString();
            values.billType = parseInt(values.billType);
            if (typeof values.excludedFlats == "string") {
                values.excludedFlats = values.excludedFlats.split(",");
            }
            setLoading(true);
            generateBill(values);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        }
    }

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">Generate Bills</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/billing/viewbills"} >View All Bills</Link>
                </div>
            </div>
            {loading &&
                <div className="project__body">
                    <Loading />
                </div>
            }
            {(success) &&
                <div className="project__body">
                    <div className="project__body--content">
                        <div className="project__body--contentBody">
                            <div className="error">{error}</div>
                            <div className="successBill">{parse(success)}</div>
                        </div>
                    </div>
                </div>
            }
            {(error && !success) &&
                <div className="project__body">
                    <div className="project__body--content">
                        <div className="project__body--contentBody">
                            <div className="error">{error}</div>
                        </div>
                    </div>
                </div>
            }
            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        <Formik
                            enableReinitialize
                            validateOnMount={true}
                            initialValues={BillStructure}
                            validationSchema={Yup.object({
                                // projectsBillingInformations: Yup.object({
                                //     CAM_penalize_percentage: Yup.string()
                                //         .required('Required'),
                                //     electricity_penalize_percentage: Yup.string()
                                //         .required('Required'),
                                //     IFMS_balance: Yup.string()
                                //         .required('Required'),
                                //     CAM_fixed_charge: Yup.string()
                                //         .required('Required'),
                                //     water_charge: Yup.string()
                                //         .required('Required'),
                                //     lift_charge: Yup.string()
                                //         .required('Required'),
                                //     CAM_charge_multiplier: Yup.string()
                                //         .required('Required'),
                                //     DG_charge_multiplier: Yup.string()
                                //         .required('Required')
                                // }),
                                dueDate: Yup.string()
                                    .required('Required')
                                //billType: Yup.string()
                                //.notOneOf(['0'])
                                //.required('Please indicate your communications preference')
                                //startedOn: Yup.string()
                                //    .required('Required')
                            })}
                            onSubmit={(values, { setSubmitting }) => {
                                SaveBill(values, setSubmitting);
                            }}
                            onReset={() => {
                                setSelectedMonth(new Date());
                                setSelectedYear(new Date());
                                return BillStructure;
                            }}
                        >
                            {props => {
                                const {
                                    handleChange
                                } = props;
                                return (
                                    <Form className="ProjectForm">
                                        <div className="row">
                                            <div className="form-group">
                                                <label className="input-label">Bill Type</label>
                                                <select name="billType" onChange={handleChange} className={cm(classes.selectDropdown, "input-text")} >
                                                    <option value="-1">Choose Bill Type</option>
                                                    <option value="1">Cam</option>
                                                    <option value="2">Electricity</option>
                                                    <option value="3">Adhoc</option>
                                                </select>
                                            </div>
                                            <MyTextInput
                                                label="Due days"
                                                name="dueDate"
                                                type="number"
                                                placeholder="Due days"
                                                className="input-text wid50"
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="form-group">
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
                                            <div className="form-group">
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
                                        </div>
                                        <div className="form-group wid100">
                                            <label className="input-label">Excluded Properties</label>
                                            <textarea
                                                onChange={handleChange}
                                                name="excludedFlats"
                                                className={classes.remarks}
                                                placeholder="Comma Seprated Property Nos.">
                                            </textarea>
                                        </div>
                                        <div className="row justify-center">
                                            <button disabled={loading == true ? true : ""} className={cm("blue_button", "dbutton", "editUp", "btn")} type="submit">
                                                Generate
                                                        </button>
                                            <button className={cm("grey_button", "dbutton", "btn")} type="reset">Cancel</button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GenerateBill;
