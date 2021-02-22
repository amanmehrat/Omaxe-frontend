
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';
import cm from "classnames";

import search from "../../img/search.svg";
import NoData from "../../components/NoData";
import Loading from "../../components/Loading";
import pencil_black from "../../img/pencil_black.svg";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
                console.log(data);
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
        console.log("PROJECT", projectId);
        if (projectId) {
            console.log("PROJECT2", projectId);
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
            console.log("Updated project", updatedProject);
            UpdateProject(updatedProject);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        } else {
            values.createdBy = user.id;
            console.log("Save Project", values);
            console.log(startDate);
            values.startedOn = startDate
            console.log("Save Project", values);
            CreateProject(values);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        }
    }

    useEffect(() => {
        console.log("ISRESET", isReset);
        if (isReset) {
            setProject(projectStructure);
        }
    }, [isReset])

    return (
        <div className="myprojects">
            <div className="midContainer">
                <div className="midContainer__head">
                    <div className="midContainer__head--field">
                        <img
                            src={search}
                            alt="search"
                            className="midContainer__head--field--search"
                        />
                        {/* <input
                            onChange={(e) => searchText(e)}
                            type="text"
                            placeholder="search"
                            className="midContainer__head--field--input"
                        /> */}
                    </div>
                    <div className="midContainer__head--filter">
                        <Link className="midContainer__head--filter--button" to="/Project" >View All Projects</Link>
                    </div>
                </div>
                <div className="midContainer__body">
                    <div className="">
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
                                                <div className="contentMid">
                                                    <div className="editContent">
                                                        <p className="editText">{isEdit ? "Edit" : "Add"} Project</p>
                                                        <Form className="editContentForm">
                                                            <div className="editForm">
                                                                <MyTextInput
                                                                    label="Project Name"
                                                                    name="name"
                                                                    type="text"
                                                                    placeholder="Project Name"
                                                                    className="editInput"
                                                                />
                                                            </div>
                                                            <div className="editForm">
                                                                <DatePicker
                                                                    className="editInput"
                                                                    name="startedOn"
                                                                    placeholderText="Project Start date"
                                                                    selected={startDate}
                                                                    onChange={date => { setStartDate(date); setFieldValue("startedOn", date) }}
                                                                    dateFormat="dd-MMM-yyyy"
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="editSubHead">Project Billing Information :</div>
                                                            <div className="editForm">
                                                                <MyTextInput
                                                                    label="CAM_charge_multiplier"
                                                                    name="projectsBillingInformations.CAM_charge_multiplier"
                                                                    type="number"
                                                                    placeholder="CAM Charge Multiplier"
                                                                    className="editInput wid50"
                                                                />
                                                                <MyTextInput
                                                                    label="DG_charge_multiplier"
                                                                    name="projectsBillingInformations.DG_charge_multiplier"
                                                                    type="number"
                                                                    placeholder="DG Charge Multiplier"
                                                                    className="editInput wid50"
                                                                />
                                                            </div>
                                                            <div className="editForm">
                                                                <MyTextInput
                                                                    label="CAM_penalize_percentage"
                                                                    name="projectsBillingInformations.CAM_penalize_percentage"
                                                                    type="number"
                                                                    placeholder="CAM Penalize Percentage"
                                                                    className="editInput wid50"
                                                                />
                                                                <MyTextInput
                                                                    label="electricity_penalize_percentage"
                                                                    name="projectsBillingInformations.electricity_penalize_percentage"
                                                                    type="number"
                                                                    placeholder="Electricity Penalize Percentage"
                                                                    className="editInput wid50"
                                                                />
                                                            </div>
                                                            <div className="editForm">
                                                                <MyTextInput
                                                                    label="CAM_fixed_charge"
                                                                    name="projectsBillingInformations.CAM_fixed_charge"
                                                                    type="number"
                                                                    placeholder="CAM Fixed Charge"
                                                                    className="editInput wid50"
                                                                />
                                                                <MyTextInput
                                                                    label="IFMS_balance"
                                                                    name="projectsBillingInformations.IFMS_balance"
                                                                    type="number"
                                                                    placeholder="IFMS Balance"
                                                                    className="editInput wid50"
                                                                />
                                                            </div>
                                                            <div className="editForm">
                                                                <MyTextInput
                                                                    label="lift_charge"
                                                                    name="projectsBillingInformations.lift_charge"
                                                                    type="number"
                                                                    placeholder="Lift Charge"
                                                                    className="editInput wid50"
                                                                />
                                                                <MyTextInput
                                                                    label="water_charge"
                                                                    name="projectsBillingInformations.water_charge"
                                                                    type="number"
                                                                    placeholder="Water Charge"
                                                                    className="editInput wid50"
                                                                />
                                                            </div>
                                                            <div className="editForm">
                                                                <button disabled={isSubmitting} className={cm("blue_button", "dbutton", "editUp", "btn")} type="submit">
                                                                    {isEdit ? "Update" : "Save"}
                                                                </button>
                                                                <button className={cm("grey_button", "dbutton", "btn")} type="reset">cancel</button>
                                                            </div></Form>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </Formik>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AddProject;
