import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ViewBillsGrid from '../grid/ViewBillsGrid'
import NoData from '../NoData';
import PaidVia from '../../utils/PaidViaSet';
import { Link } from 'react-router-dom';
import cm from "classnames";
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

import Loading from "../../components/Loading";

import { LogException } from "../../utils/exception";
import "react-datepicker/dist/react-datepicker.css";


import { Formik, Form } from 'formik';
import * as Yup from 'yup';


import { errorContext } from "../contexts/error/errorContext";
import { useProjectContext } from "../contexts/Project";
import AuthContext from "../contexts/Auth";
import { usePost } from "../../utils/hooks";

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
        marginBottom: '20px'
    },
    btnGroups: {
        width: '26%',
        display: 'inline-flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-between',
    }
}));

const ViewBills = () => {
    const RequestStructure = {
        billType: -1,
        year: "",
        month: "",
        projId: "",
    }
    const [bills, setBills] = useState(-1);
    const classes = useStyles();
    const history = useHistory();

    const { user } = useContext(AuthContext);
    const { selectedProjectId } = useProjectContext();
    if (!selectedProjectId) history.push("/projects");


    const [billType, setBillType] = useState(-1)
    const [viewBillRequest, setViewBillRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadViewBills, setLoadViewBills] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [error, setError] = useState("");

    const { run: viewBills } = usePost("/billing/viewBills",
        null,
        {
            onResolve: (data) => {
                console.log(data);
                if (typeof data.Bills == "string") {
                    data.Bills = [];
                }
                data.Bills.map(item => { item.paidVia = PaidVia.get(item.paidVia); return item; })
                console.log("BILLS", data.Bills);
                setBills(data.Bills);
                setLoading(false);
                setLoadViewBills(false);
            },
            onReject: (err) => {
                setError("Unable To view electricity bill, Please Contact Tech-Team");
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
        setViewBillRequest(values);
        viewBills(values);
        setTimeout(() => {
            setSubmitting(false);
        }, 400);
    }
    const getExportBills = (values, setSubmitting) => {
        setLoading(true);
        const yearString = new Date(selectedYear).getFullYear();
        const monthString = new Date(selectedMonth).getMonth() + 1;
        values.projId = selectedProjectId;///comment remove
        values.year = yearString.toString();
        values.month = monthString.toString();
        //values.createdBy = user.id;
        values.billType = parseInt(values.billType);
        setBillType(values.billType);
        console.log("Updatedvalues", values);
        setViewBillRequest(values);
        viewBills(values);
        axios.post(`${config.restApiBase}/billing/downloadBillsCSV`,
            values
        ).then(response => {
            setLoading(false);
            console.log(response);
            let { data } = response;
            if (data && data.meta) {
                LogException("Unable To Download Excel. Please Contact To Tech-Team");
            } else {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Bills-${values.month}-${values.year}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }).catch((error) => {
            setLoading(false);
            LogException("Unable To Download view bill excel" + error);
        });
        // values.projectId = selectedProjectId;//total remove
        // values.flatNumber = "AIFC/SF/523E";//total remove
        // values.year = yearString.toString();
        // values.month = monthString.toString();
        // values.billType = parseInt(values.billType);
        // let obj = { projectId: values.projectId, flatNumber: values.flatNumber, month: values.month, year: values.year, billType: values.billType }
        // axios.post(`${config.restApiBase}/billing/downloadReceipts`,
        //     obj
        // ).then(response => {
        //     setLoading(false);
        //     console.log(response);
        //     let { data } = response;
        //     console.log(data);
        //     if (data && data.meta) {
        //         setError("Unable To Download Excel. Please Contact To Tech-Team");
        //         LogException("Unable To Download Excel. Please Contact To Tech-Team");
        //     } else {
        //         const url = window.URL.createObjectURL(new Blob([response.data]));
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.setAttribute('download', `Bills-${values.month}-${values.year}.html`);
        //         document.body.appendChild(link);
        //         link.click();
        //         link.remove();
        //         html2canvas(data)
        //             .then((canvas) => {
        //                 const imgData = canvas.toDataURL('image/png');

        //                 const url = window.URL.createObjectURL(new Blob([response.data]));
        //                 const link = document.createElement('a');
        //                 link.href = url;
        //                 link.setAttribute('download', `Bills-${values.month}-${values.year}.html`);
        //                 document.body.appendChild(link);
        //                 link.click();
        //                 link.remove();
        //                 const pdf = new jsPDF('p', 'px', 'a4');
        //                 var width = pdf.internal.pageSize.getWidth();
        //                 var height = pdf.internal.pageSize.getHeight();

        //                 pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
        //                 pdf.save("test.pdf");
        //             });
        //         // const doc = new jsPDF();
        //         // var pdf = new jsPDF('l', 'pt', 'a4');
        //         // var options = {
        //         //     pagesplit: true
        //         // };

        //         // pdf.html(data, 0, 0, options, function () {
        //         //     console.log("YES--")
        //         //     pdf.save("test.pdf");
        //         // });
        //         // doc.text(data, 10, 10);
        //         // doc.save("a4.pdf");

        //     }
        // }).catch((error) => {
        //     setLoading(false);
        //     LogException("Unable To Download view bill excel" + error);
        // });


        setTimeout(() => {
            setSubmitting(false);
        }, 400);
    }

    useEffect(() => {
        if (loadViewBills)
            viewBills(viewBillRequest);
    }, [loadViewBills]);
    const renderViewTable = () => {
        if (loading) {
            return <Loading />
        } if (bills == -1) {
            return "";
        } else if (bills && bills.length > 0) {
            return <ViewBillsGrid bills={bills} billType={billType} setLoadViewBills={setLoadViewBills} />
        } else {
            return <NoData text="No Bills Found" />;
        }
    }

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">View Bills</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/billing/generatebill"} >Generate Bill</Link>
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
                                if (values.isForExport) {
                                    delete values["isForExport"];
                                    getExportBills(values, setSubmitting);
                                } else {
                                    getViewBills(values, setSubmitting);
                                }
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
                                    handleChange,
                                    setFieldValue
                                } = props;
                                return (
                                    <Form className={cm(classes.formBorder, "ProjectForm")}>
                                        <div className={cm(classes.dropdownDiv)}>
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
                                        <div className={classes.btnGroups}>
                                            <button disabled={isSubmitting} className={cm("project__header--filter--button materialBtn")} type="submit">
                                                View Bills
                                            </button>
                                            <span>OR</span>
                                            <button disabled={isSubmitting} className={cm("project__header--filter--button materialBtn")}
                                                onClick={() => {
                                                    setFieldValue('isForExport', true);
                                                }}
                                                type="submit"
                                            >
                                                Export Data
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                        {error && <div className="error">error</div>}
                        {renderViewTable()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewBills;
