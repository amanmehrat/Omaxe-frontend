import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ViewBillsGrid from '../grid/ViewBillsGrid'
import NoData from '../NoData';
import { Link } from 'react-router-dom';
import cm from "classnames";

import Loading from "../../components/Loading";

import { LogException } from "../../utils/exception";
import "react-datepicker/dist/react-datepicker.css";


import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MyTextInput from '../../components/customInputs/MyTextInput';

import { errorContext } from "../contexts/error/errorContext";
import { useProjectContext } from "../contexts/Project";
import AuthContext from "../contexts/Auth";
import { usePost } from "../../utils/hooks";


const useStyles = makeStyles((theme) => ({
    groups: {
        display: 'inline-block',
    },
    dropdownDiv: {
        display: 'inline-flex',
        flexDirection: 'column',
        float: 'left'
    },
    selectDropdown: {
        color: '#495057',
        border: '1px solid #ced4da',
        outline: 'none',
        fontSize: '14px',
        padding: '7px',
        borderRadius: '100px',
        marginTop: '11px'
    },
    selectInputDiv: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    formBorder: {
        border: '1px solid rgba(211,211,211,0.3)',
        padding: '12px',
        marginBottom: '20px'
    }
}));

const ViewBills = () => {
    const RequestStructure = {
        billType: -1,
        year: "",
        month: "",
        projId: "",
    }
    const [bills, setBills] = useState([]);
    const classes = useStyles();
    const history = useHistory();

    const errorCtx = useContext(errorContext);
    const { user } = useContext(AuthContext);
    const { selectedProjectId } = useProjectContext();
    if (!selectedProjectId) history.push("/projects");


    const [billType, setBillType] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const { run: viewBills } = usePost("/billing/viewBills",
        null,
        {
            onResolve: (data) => {
                console.log(data);
                if (typeof data.Bills == "string") {
                    data.Bills = [];
                }
                console.log("BILLS", data.Bills);
                setBills(data.Bills);
                setLoading(false);
            },
            onReject: (err) => {
                setLoading(false);
                console.log(err);
                LogException("Unable To View bills", err);
            }
        });

    const getViewBills = (values, setSubmitting) => {
        setLoading(true);
        const yearString = new Date(selectedYear).getFullYear();
        const monthString = new Date(selectedMonth).getMonth() + 1;
        values.projId = selectedProjectId;
        values.year = yearString.toString();
        values.month = monthString.toString();
        //values.createdBy = user.id;
        values.billType = parseInt(values.billType);
        setBillType(values.billType);
        console.log("Updatedvalues", values);
        viewBills(values);
        setTimeout(() => {
            setSubmitting(false);
        }, 400);
    }

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">Generate Bill</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/Project/" + selectedProjectId} >View All Bills</Link>
                </div>
            </div>
            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        <Formik
                            enableReinitialize
                            validateOnMount={true}
                            initialValues={RequestStructure}
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
                                getViewBills(values, setSubmitting);
                            }}
                            onReset={() => {
                                setSelectedMonth(new Date());
                                setSelectedYear(new Date());
                                return RequestStructure;
                            }}
                        >
                            {props => {
                                const {
                                    isSubmitting,
                                    handleChange
                                } = props;
                                return (
                                    <Form className={cm(classes.formBorder, "ProjectForm")}>
                                        <div className={cm(classes.dropdownDiv, "wid30")}>
                                            <label className="input-label">Bill Type</label>
                                            <select name="billType" onChange={handleChange} className={cm(classes.selectDropdown, "input-text")} >
                                                <option value="-1">Choose Bill Type</option>
                                                <option value="1">Cam</option>
                                                <option value="2">Electricity</option>
                                                <option value="3">Adhoc</option>
                                            </select>
                                        </div>
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
                                        <button disabled={isSubmitting} className={cm("blue_button", "dbutton", "editUp", "btn", classes.groups)} type="submit">
                                            View Bills
                                        </button>
                                    </Form>
                                );
                            }}
                        </Formik>
                        {
                            bills.length > 0 ?
                                <ViewBillsGrid bills={bills} billType={billType} /> :
                                <NoData text="No Bills Found" />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewBills;