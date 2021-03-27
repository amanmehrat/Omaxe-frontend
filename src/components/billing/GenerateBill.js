import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';

import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import cm from "classnames";

import Loading from "../../components/Loading";

import { LogException } from "../../utils/exception";
import "react-datepicker/dist/react-datepicker.css";
//import './AddFlat.css'


import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MyTextInput from '../../components/customInputs/MyTextInput';

import { errorContext } from "../contexts/error/errorContext";
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

    const errorCtx = useContext(errorContext);
    const { user } = useContext(AuthContext);
    const { selectedProjectId } = useProjectContext();
    if (!selectedProjectId) history.push("/projects");


    const [loading, setLoading] = useState(false)
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const { run: generateBill } = usePost("/billing/generateBill",
        null,
        {
            onResolve: (data) => {
                console.log(data);
                errorCtx.setSuccess("Bill Generated Successfully");
                history.push("/billing/Generatebill");
            },
            onReject: (err) => {
                console.log(err);
                LogException("Unable To Generate Bill", err);
                errorCtx.setError(err);
            }
        });

    const SaveBill = (values, setSubmitting) => {
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


        console.log("Updatedvalues", values);
        generateBill(values);
        setTimeout(() => {
            setSubmitting(false);
        }, 400);
    }

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">Generate Bill</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/billing/viewbills"} >View All Bills</Link>
                </div>
            </div>
            <div className="project__body">
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
                        //name: Yup.string()
                        //  .max(50, 'Must be 50 characters or less')
                        // .required('Required')
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
                            isSubmitting,
                            handleChange
                        } = props;
                        return (
                            <div className="project__body--content">
                                <div className="project__body--contentBody">
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
                                        </div>
                                        <div className="row">
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
                                        <div className="row">
                                            <MyTextInput
                                                label="Excluded Properties"
                                                name="excludedFlats"
                                                type="text"
                                                placeholder="Comma Sperated Property Nos."
                                                className="input-text"
                                            />
                                        </div>
                                        <div></div>
                                        <div className="row">
                                            <MyTextInput
                                                label="Due days"
                                                name="dueDate"
                                                type="number"
                                                placeholder="Due days"
                                                className="input-text"
                                            />
                                        </div>
                                        <div className="row">
                                            <button disabled={isSubmitting} className={cm("blue_button", "dbutton", "editUp", "btn")} type="submit">
                                                Generate
                                                        </button>
                                            <button className={cm("grey_button", "dbutton", "btn")} type="reset">Cancel</button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        );
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default GenerateBill;
