
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';
import cm from "classnames";

import search from "../../img/search.svg";
import Loading from "../../components/Loading";
import pencil_black from "../../img/pencil_black.svg";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AddProject.css'


import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MyTextInput from '../../components/customInputs/MyTextInput';

import { errorContext } from "../../components/contexts/error/errorContext";
import AuthContext from "../../components/contexts/Auth";
import { useGet, usePost, usePut } from "../../utils/hooks";


//import "./AddProject.scss";


const AddProject = ({ history }) => {
    let projectStructure = {
        createdBy: "",
        name: "",
        startedOn: "",
        projectsBillingInformations: {
            CAM_charge_multiplier: "",
            DG_charge_multiplier: "",
            CAM_penalize_percentage: "",
            electricity_penalize_percentage: "",
            CAM_fixed_charge: "",
            IFMS_balance: "",
            lift_charge: "",
            water_charge: "",
        }
    }

    const { projectId } = useParams();
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const { user } = useContext(AuthContext);
    const [startDate, setStartDate] = useState(null);
    const [project, setProject] = useState(projectStructure);

    const { run: getProjectById } = usePost("/projects/GetProject", null,
        {
            onResolve: (data) => {
                 let requiredProject = data?.projects.find(project => project.id == projectId);
                setStartDate(new Date(requiredProject?.startedOn));
                requiredProject.projectsBillingInformations = requiredProject?.projectsBillingInformations?.find(billingInfo => billingInfo.proj_id == projectId);
                setProject(requiredProject);
                setLoading(false);
            },
            onReject: (err) => {
                errorCtx.setError(err);
                setLoading(false);
            }
        });

    const errorCtx = useContext(errorContext);

    useEffect(() => {
    if (projectId) {
            setLoading(true);
            setIsEdit(true);
            getProjectById({ projId: projectId });
        }
    }, [projectId]);


    const { run: CreateProject } = usePost("/projects/AddProject",
        null,
        {
            onResolve: (data) => {
                errorCtx.setSuccess("Project Saved Successfully");
                //errorCtx.setSuccess(true);                
                setIsReset(true);
                history.push("/projects");
            },
            onReject: (err) => {
                errorCtx.setError(err);
            }
        });

    const { run: UpdateProject } = usePost("/projects/UpdateProject",
        null,
        {
            onResolve: (data) => {
                errorCtx.setSuccess("Project Updated Successfully");
                history.push("/projects");
            },
            onReject: (err) => {
                errorCtx.setError(err);
            }
        });

    const SaveProject = (values, setSubmitting) => {
        if (isEdit) {
            const { id, name, startedOn, projectsBillingInformations } = values;
            delete projectsBillingInformations["id"];
            delete projectsBillingInformations["proj_id"];
            let updatedProject = { proj_id: id, name, startedOn, projectsBillingInformations };
            UpdateProject(updatedProject);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        } else {
            values.createdBy = user.id;
            values.startedOn = startDate
            CreateProject(values);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        }
    }

    useEffect(() => {
        if (isReset) {
            setProject(projectStructure);
        }
    }, [isReset])

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">{isEdit ? "Edit" : "Add"} Project</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to="/Projects" >View All Projects</Link>
                </div>
            </div>
            <div className="project__body">
                {
                    loading ? <Loading /> :
                        <>
                            <Formik
                                enableReinitialize
                                validateOnMount={true}
                                initialValues={project}
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
                                    name: Yup.string()
                                        .max(50, 'Must be 50 characters or less')
                                        .required('Required')
                                    //startedOn: Yup.string()
                                    //    .required('Required')
                                })}
                                onSubmit={(values, { setSubmitting }) => {
                                    SaveProject(values, setSubmitting);
                                }}
                                onReset={() => { setStartDate(null); return projectStructure; }}
                            >
                                {props => {
                                    const {
                                        isSubmitting,
                                        setFieldValue
                                    } = props;
                                    return (
                                        <div className="project__body--content">
                                            <div className="project__body--contentBody">
                                                <Form className="ProjectForm">
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="Project Name"
                                                            name="name"
                                                            type="text"
                                                            placeholder="Project Name"
                                                            className="input-text"
                                                        />
                                                        <div className="form-group">
                                                            <label className="input-label">Project Started On</label>
                                                            <DatePicker
                                                                className="input-text wid-100"
                                                                name="startedOn"
                                                                placeholderText="Project Start date"
                                                                selected={startDate}
                                                                onChange={date => { setStartDate(date); setFieldValue("startedOn", date) }}
                                                                dateFormat="dd-MMM-yyyy"
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="formSubHeading"><b>Project Billing Information :</b></div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="CAM_charge_multiplier"
                                                            name="projectsBillingInformations.CAM_charge_multiplier"
                                                            type="number"
                                                            placeholder="CAM Charge Multiplier"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="DG_charge_multiplier"
                                                            name="projectsBillingInformations.DG_charge_multiplier"
                                                            type="number"
                                                            placeholder="DG Charge Multiplier"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="CAM_penalize_percentage"
                                                            name="projectsBillingInformations.CAM_penalize_percentage"
                                                            type="number"
                                                            placeholder="CAM Penalize Percentage"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="electricity_penalize_percentage"
                                                            name="projectsBillingInformations.electricity_penalize_percentage"
                                                            type="number"
                                                            placeholder="Electricity Penalize Percentage"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="CAM_fixed_charge"
                                                            name="projectsBillingInformations.CAM_fixed_charge"
                                                            type="number"
                                                            placeholder="CAM Fixed Charge"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="IFMS_balance"
                                                            name="projectsBillingInformations.IFMS_balance"
                                                            type="number"
                                                            placeholder="IFMS Balance"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="lift_charge"
                                                            name="projectsBillingInformations.lift_charge"
                                                            type="number"
                                                            placeholder="Lift Charge"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="water_charge"
                                                            name="projectsBillingInformations.water_charge"
                                                            type="number"
                                                            placeholder="Water Charge"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row btn-group">
                                                        <button disabled={isSubmitting} className={cm("blue_button", "dbutton", "editUp", "btn")} type="submit">
                                                            {isEdit ? "Update" : "Save"}
                                                        </button>
                                                        <button className={cm("grey_button", "dbutton", "btn")} type="reset">Cancel</button>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                    );
                                }}
                            </Formik>
                        </>
                }
            </div>
        </div>
    )
}

export default AddProject;
