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
import { useGet, usePost } from "../../utils/hooks";

import axios from 'axios';
import config from '../../config';
import AuthContext from "../contexts/Auth";

const useStyles = makeStyles((theme) => ({
    groups: {
        display: 'inline-block',
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
    CheckBox: {
        padding: '5px',
        marginRight: '2px'
    },
    btn: {
        textAlign: 'center',
    }
}));

const DownloadReport = () => {

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedProjectIds, setSelectedProjectIds] = useState([]);
    const [error, setError] = useState("");
    const classes = useStyles();
    const history = useHistory();


    const { run: getProjectList } = useGet("/projects", null,
        {
            onResolve: (data) => {
                setProjects(data.projects);
                setLoading(false);
            },
            onReject: (error) => {
                LogException("Unable to get ProjectList", error);
                setLoading(false);
            }
        });

    const getExportReport = () => {
        setError("");
        console.log("month", selectedMonth);
        let exportObject = {
            projIds: selectedProjectIds,
            year: new Date(selectedYear).getFullYear().toString(),
            month: (new Date(selectedMonth).getMonth() + 1).toString(),
        }
        axios.post(`${config.restApiBase}/billing/getReport`,
            exportObject
        ).then(response => {
            let { data } = response;
            if (data && data.meta) {
                LogException("Unable To Download Excel. Please Contact To Tech-Team" + data.error);
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
    function onCheckedProject(e) {
        //console.log(e.target);
        let checkedProjects = selectedProjectIds;
        if (e.target.checked) {
            checkedProjects.push(e.target.value);
            setSelectedProjectIds(selectedProjectIds)
        } else {
            let idx = checkedProjects.indexOf(e.target.value);
            checkedProjects.splice(idx, 1);
            setSelectedProjectIds(checkedProjects);
        }
        console.log(selectedProjectIds);
    }
    useEffect(() => {
        setLoading(true);
        getProjectList();
    }, []);

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">Export Report</div>
            </div>
            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        {loading ? <Loading /> : <>
                            <form className={cm(classes.formBorder, "ProjectForm")}>
                                <div className={cm(classes.groups, "width50")}>
                                    <label className="input-label">Select Year</label>

                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <KeyboardDatePicker
                                            className="input-text width50"
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
                                <div className={cm(classes.groups, "width50")}>
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
                                <div className="mar10">
                                    <label className="input-label row mar10">Choose Projects </label>
                                    {
                                        projects && projects.map(project =>
                                            <label key={project.id} className={cm(classes.CheckBox, "form-check-label")} style={{ wordWrap: 'break-word', fontSize: '1.6rem' }}>
                                                <input type="checkbox" value={project.id} onChange={(e) => onCheckedProject(e)} style={{ verticalAlign: 'middle', marginRight: '0.26rem' }} />
                                                {project.name}
                                            </label>
                                        )
                                    }
                                </div>
                                <div className={classes.btn}>
                                    <button className={cm("project__header--filter--button materialBtn")}
                                        onClick={(e) => { e.preventDefault(); getExportReport() }}
                                    >
                                        Download Report
                                </button>
                                </div>
                            </form>
                            {error && <div className="error">{error}</div>}
                        </>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default DownloadReport;
