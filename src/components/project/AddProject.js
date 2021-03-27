
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';
import cm from "classnames";

import { LogException } from "../../utils/exception";
import Loading from "../../components/Loading";

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';

import './AddProject.css'


import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MyTextInput from '../../components/customInputs/MyTextInput';

import { errorContext } from "../../components/contexts/error/errorContext";
import AuthContext from "../../components/contexts/Auth";
import { usePost } from "../../utils/hooks";


//import "./AddProject.scss";


const AddProject = ({ history }) => {
    let projectStructure = {
        createdBy: "",
        name: "",
        startedOn: new Date(),
        address: "",
        totalUnits: "",
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
    const [project, setProject] = useState(projectStructure);

    const { run: getProjectById } = usePost("/projects/GetProject", null,
        {
            onResolve: (data) => {
                let requiredProject = data?.projects.find(project => project.id == projectId);
                requiredProject.projectsBillingInformations = requiredProject?.projectsBillingInformations?.find(billingInfo => billingInfo.proj_id == projectId);
                setProject(requiredProject);
                setLoading(false);
            },
            onReject: (err) => {
                LogException("Unable To get Project By Id", err);
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
                history.push("/project/add");
            },
            onReject: (err) => {
                LogException("Unable To Create Project", err);
                errorCtx.setError(err);
            }
        });

    const { run: UpdateProject } = usePost("/projects/UpdateProject",
        null,
        {
            onResolve: (data) => {
                errorCtx.setSuccess("Project Updated Successfully");
                history.push("/project/edit/" + projectId);
            },
            onReject: (err) => {
                LogException("Unable To Unable Project", err);
                errorCtx.setError(err);
            }
        });

    const SaveProject = (values, setSubmitting) => {
        if (isEdit) {
            const { id, name, startedOn, projectsBillingInformations, address, totalUnits } = values;
            delete projectsBillingInformations["id"];
            delete projectsBillingInformations["proj_id"];
            let updatedProject = { projId: id, name, startedOn, projectsBillingInformations, address, totalUnits };
            UpdateProject(updatedProject);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        } else {
            values.createdBy = user.id;
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
                                        .required('Required'),
                                    address: Yup.string()
                                        .max(500, 'Must be 500 characters or less')
                                        .required('Required'),
                                    totalUnits: Yup.string()
                                        .required('Required'),
                                    startedOn: Yup.string()
                                        .required('Required')
                                })}
                                onSubmit={(values, { setSubmitting }) => {
                                    SaveProject(values, setSubmitting);
                                }}
                                onReset={() => projectStructure}
                            >
                                {props => {
                                    const {
                                        isSubmitting,
                                        setFieldValue,
                                        values,
                                        touched,
                                        errors
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
                                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                                <KeyboardDatePicker
                                                                    className="input-text"
                                                                    variant="inline"
                                                                    format="DD-MM-YYYY"
                                                                    margin="normal"
                                                                    value={values.startedOn}
                                                                    id="date-picker-inline"
                                                                    name="startedOn"
                                                                    onChange={date => { setFieldValue('startedOn', date.format("yyyy-MM-DD")) }}
                                                                    autoOk
                                                                    autoComplete="off"
                                                                />
                                                            </MuiPickersUtilsProvider>
                                                            {
                                                                touched.startedOn && errors.startedOn ? (
                                                                    <div className="errorLabel">{errors.startedOn}</div>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="Address"
                                                            name="address"
                                                            type="text"
                                                            placeholder="Address"
                                                            className="input-text"
                                                        />
                                                        <MyTextInput
                                                            label="Total Units"
                                                            name="totalUnits"
                                                            type="number"
                                                            placeholder="Total Units"
                                                            className="input-text"
                                                        />
                                                    </div>
                                                    <div className="formSubHeading"><b>Project Billing Information :</b></div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="CAM Charge Multiplier"
                                                            name="projectsBillingInformations.CAM_charge_multiplier"
                                                            type="number"
                                                            placeholder="CAM Charge Multiplier"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="DG Charge Multiplier"
                                                            name="projectsBillingInformations.DG_charge_multiplier"
                                                            type="number"
                                                            placeholder="DG Charge Multiplier"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="CAM Penalize Percentage"
                                                            name="projectsBillingInformations.CAM_penalize_percentage"
                                                            type="number"
                                                            placeholder="CAM Penalize Percentage"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="Electricity Penalize Percentage"
                                                            name="projectsBillingInformations.electricity_penalize_percentage"
                                                            type="number"
                                                            placeholder="Electricity Penalize Percentage"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="CAM Fixed Charge"
                                                            name="projectsBillingInformations.CAM_fixed_charge"
                                                            type="number"
                                                            placeholder="CAM Fixed Charge"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="IFMS Balance"
                                                            name="projectsBillingInformations.IFMS_balance"
                                                            type="number"
                                                            placeholder="IFMS Balance"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="Lift Charge"
                                                            name="projectsBillingInformations.lift_charge"
                                                            type="number"
                                                            placeholder="Lift Charge"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="ater Charge"
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
        </div >
    )
}

export default AddProject;
