import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ViewBillsGrid from '../grid/ViewBillsGrid'
import NoData from '../NoData';
import PaidVia from '../../utils/PaidViaSet';
import { Link } from 'react-router-dom';
import cm from "classnames";

import Loading from "../../components/Loading";

import { LogException } from "../../utils/exception";

import { Formik, Form } from 'formik';

import { useProjectContext } from "../contexts/Project";
import { usePost } from "../../utils/hooks";

import axios from 'axios';
import config from '../../config';
import AuthContext from "../contexts/Auth";

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
    const { user } = useContext(AuthContext);
    const [bills, setBills] = useState(-1);
    const classes = useStyles();
    const history = useHistory();

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
                if (typeof data.Bills == "string") {
                    data.Bills = [];
                }
                data.Bills.map(item => { item.paidVia = PaidVia.get(item.paidVia); return item; })
                setBills(data.Bills);
                setLoading(false);
            },
            onReject: (err) => {
                setBills([]);
                setError("Unable To view electricity bill, Please Contact Tech-Team");
                setLoading(false);
                LogException("Unable To View bills", err);
            }
        });

    const getViewBills = (values) => {
        setError("");
        setLoading(true);
        let billObject = {
            projId: selectedProjectId,
            year: new Date(selectedYear).getFullYear().toString(),
            month: (new Date(selectedMonth).getMonth() + 1).toString(),
            //createdBy = user.id,
            billType: parseInt(values.billType)
        }
        setBillType(values.billType);
        setViewBillRequest(billObject);
        viewBills(billObject);
    }
    const getExportBills = (values) => {
        setError("");
        let exportObject = {
            projId: selectedProjectId,
            year: new Date(selectedYear).getFullYear().toString(),
            month: (new Date(selectedMonth).getMonth() + 1).toString(),
            //createdBy = user.id,
            billType: parseInt(values.billType)
        }
        //setBillType(values.billType);
        //setViewBillRequest(values);
        //viewBills(values);
        axios.post(`${config.restApiBase}/billing/downloadBillsCSV`,
            exportObject
        ).then(response => {
            let { data } = response;
            if (data && data.meta) {
                LogException("Unable To Download Excel. Please Contact To Tech-Team");
            } else {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Bills-${exportObject.month}-${exportObject.year}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }).catch((error) => {
            setError("Unable to download Excel");
            LogException("Unable To Download view bill excel" + error);
        });
    }

    useEffect(() => {
        if (loadViewBills) {
            viewBills(viewBillRequest);
            setLoadViewBills(false);
        }

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
                    {(user && user.role == "admin") && <Link className="project__header--filter--button" to={"/billing/generateBills"} >Generate Bill</Link>}
                </div>
            </div>
            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        <Formik
                            initialValues={RequestStructure}
                            onSubmit={(values) => {
                                getViewBills(values);
                            }}
                        >
                            {props => {
                                const {
                                    handleChange,
                                    values
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
                                            <button className={cm("project__header--filter--button materialBtn")} type="submit">
                                                View Bills
                                            </button>
                                            <span>OR</span>
                                            <button className={cm("project__header--filter--button materialBtn")}
                                                onClick={(e) => { e.preventDefault(); getExportBills(values) }}
                                            >
                                                Export Data
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                        {error && <div className="error">{error}</div>}
                        {renderViewTable()}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default React.memo(ViewBills);
