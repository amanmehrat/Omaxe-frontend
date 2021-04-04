import { makeStyles } from '@material-ui/core/styles';

import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import cm from "classnames";
import pencil_black from "../../img/pencil_black.svg";
import NoData from "../NoData";
import { LogException } from "../../utils/exception";


import Loading from "../../components/Loading";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MyTextInput from '../../components/customInputs/MyTextInput';

import { errorContext } from "../contexts/error/errorContext";
import { useProjectContext } from "../contexts/Project";
import { useGet, usePost } from "../../utils/hooks";


const useStyles = makeStyles((theme) => ({
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: '12px',
        marginTop: '5px'
    },
    success: {
        color: 'green',
        textAlign: 'center',
        fontSize: '12px',
        marginTop: '5px'
    },
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
    formHeading: {
        color: '#495057',
        textAlign: 'center',
        fontSize: '2.5rem'
    },
    form: {
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        padding: '1.3rem',
        marginBottom: '2rem'
    },
    radioGroup: {
        justifyContent: 'center',
        fontSize: '1.7rem',
        alignItems: 'center'
    },
    editBTN: {
        border: 'none',
        background: 'white',
        outline: 'none'
    }

}));

const Billing = () => {
    const billingHeadStructure = {
        billingHead: "",
        billingGroup: "",
        isActive: true,
    }
    const classes = useStyles();
    const history = useHistory();
    const errorCtx = useContext(errorContext);

    const { selectedProjectId } = useProjectContext();
    if (!selectedProjectId) history.push("/projects");

    const [isLoadBillingHeads, setIsLoadBillingHeads] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [billingHead, setBillingHead] = useState(billingHeadStructure);
    const [billingHeadId, setBillingHeadId] = useState(0);
    const [billingHeads, setBillingHeads] = useState(null);


    const { run: getBillingHeads } = usePost("/billing/billingHeads", null,
        {
            onResolve: (data) => {
                setBillingHeads(data.billingHeads);
                setLoading(false);
            },
            onReject: (err) => {
                LogException("Unable To get Billingheads", err);
            }
        });
    const { run: getBillingHeadById } = usePost("/billing/billingHeads/getBillingHeadById", null,
        {
            onResolve: (data) => {
                setBillingHead(data?.billingHead.find(billingHead => billingHead.id == billingHeadId));
                setBillingHeadId(0);
            },
            onReject: (err) => {
                LogException("Unable To get BillingHeadById", err);
            }
        });
    const { run: CreateBillingHead } = usePost("/billing/billingHeads/insertBillingHead", null,
        {
            onResolve: (data) => {
                setIsLoadBillingHeads(true);
                setIsView(false);
                errorCtx.setSuccess("Billing Head Saved Successfully");
                setIsReset(true);
            },
            onReject: (err) => {
                errorCtx.setError(err);
                LogException("Unable To Create Billingheads", err);
            }
        });
    const { run: UpdateBillingHead } = usePost("/billing/billingHeads/updateBillingHead", null,
        {
            onResolve: (data) => {
                setIsLoadBillingHeads(true);
                setIsView(false)
                setBillingHead(billingHeadStructure);
                setIsEdit(false);
                setBillingHeadId(0);
                errorCtx.setSuccess("Billing Head Updated Successfully");
            },
            onReject: (err) => {
                LogException("Unable To Update Billingheads", err);
                errorCtx.setError(err);
            }
        });

    useEffect(() => {
        if (selectedProjectId) {
            getBillingHeads({ projectId: selectedProjectId });
        }
    }, [selectedProjectId, isLoadBillingHeads]);

    useEffect(() => {
        if (isEdit && selectedProjectId && billingHeadId != 0) {
            getBillingHeadById({ projectId: selectedProjectId, billingHeadId: billingHeadId });
        }
    }, [isEdit, billingHeadId]);

    const SaveBillingHead = (values, setSubmitting) => {
        if (isEdit) {
            let updatedBillingHeads = {
                projectId: values.projectId,
                billingHeadId: values.id,
                updatedValues: {
                    billingHead: values.billingHead,
                    billingGroup: values.billingGroup,
                    isActive: values.isActive
                }
            }
            UpdateBillingHead(updatedBillingHeads);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        } else {
            //values.createdBy = user.id;
            let insertedProject = {
                billingHead: {
                    projectId: selectedProjectId,
                    billingHead: values.billingHead,
                    isActive: values.isActive,
                    billingGroup: values.billingGroup
                }
            }
            CreateBillingHead(insertedProject);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        }
    }

    useEffect(() => {
        if (isReset) {
            setBillingHead(billingHeadStructure);
        }
    }, [isReset])

    const renderBillingHeads = () => {
        if (billingHeads && billingHeads.length > 0) {
            return [
                billingHeads.map(billingHeadObject => {
                    let { id, billingHead, billingGroup, isActive } = billingHeadObject;
                    return (
                        <div key={id} className={cm("parentGrid", { "parentGrid__active": false })}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="child1 ">
                                <p className="text pointer">{billingHead}</p>
                            </div>
                            <div className="child3">
                                <p className="text pointer">{billingGroup}</p>
                            </div>
                            <div className="child4">
                                <p className="text pointer">{isActive ? "Active" : "De-Active"}</p>
                            </div>
                            <div className="child6">
                                <button className={cm("icon", "pointer", classes.editBTN)} onClick={(e) => { setIsEdit(true); setBillingHeadId(id); }}>
                                    <img src={pencil_black}
                                        alt={"edit"}
                                    />
                                </button>
                            </div>
                        </div >
                    )
                })
            ]
        } else {
            return <NoData />;
        }
    }

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">Billing Heads</div>
                <div className="project__header--filter">
                    <button className="project__header--filter--button" onClick={() => setIsView(true)}>Add Billing Head</button>
                </div>
            </div>

            <div className="project__body">
                {isView || isEdit ? <>
                    {
                        loading ? <Loading /> :
                            <>
                                <Formik
                                    enableReinitialize
                                    //validateOnMount={true}
                                    initialValues={billingHead}
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
                                        //billingGroup: Yup.string()
                                        //    .required('Required'),
                                        billingHead: Yup.string()
                                            .required('Required')
                                    })}
                                    onSubmit={(values, { setSubmitting }) => {
                                        SaveBillingHead(values, setSubmitting);
                                    }}
                                    onReset={() => { setIsView(false); return billingHeadStructure }}
                                >
                                    {props => {
                                        const {
                                            isSubmitting,
                                            setFieldValue,
                                            handleChange,
                                            values
                                        } = props;
                                        return (
                                            <div className={classes.form}>
                                                <div className={classes.formHeading}>{isEdit ? "Edit" : "Add"} Billing Heads</div>
                                                <Form className="ProjectForm">
                                                    <div className="row">
                                                        <div className="form-group">
                                                            <label className="input-label">Billing Group</label>
                                                            <select name="billingGroup" value={values.billingGroup} onChange={handleChange} className={cm(classes.selectDropdown, "input-text")} >
                                                                <option value="">Choose Billing Group</option>
                                                                <option value="Maintainance">Maintainance</option>
                                                                <option value="Utility">Utility</option>
                                                                <option value="Custom">Custom</option>
                                                            </select>
                                                        </div>
                                                        <MyTextInput
                                                            label="Billing Head"
                                                            name="billingHead"
                                                            type="text"
                                                            placeholder="Billing Head"
                                                            className="input-text"
                                                        />
                                                    </div>
                                                    <div className={cm("row", "radioGroup", classes.radioGroup)} >
                                                        <label className={cm("mar-left", classes.radioGroup)} >Status: </label>
                                                        <input className={cm("mar-left", classes.radioGroup)} type="radio" name="isActive" value={true} onChange={handleChange} checked={(values.isActive == "true" || values.isActive == true) ? true : false} /> Active
                                                    <input className={cm("mar-left", classes.radioGroup)} type="radio" name="isActive" value={false} onChange={handleChange} checked={(values.isActive == "false" || values.isActive == false) ? true : false} /> De-Active
                                                    </div>
                                                    <div className="row btn-group">
                                                        <button disabled={isSubmitting} className={cm("blue_button", "dbutton", "editUp", "btn")} type="submit">
                                                            {isEdit ? "Update" : "Save"}
                                                        </button>
                                                        <button className={cm("grey_button", "dbutton", "btn")} type="reset">Cancel</button>
                                                    </div>
                                                </Form>
                                            </div>
                                        );
                                    }}
                                </Formik>
                            </>
                    }
                </> : ""}
                < div key={0} className="parentGrid gridHeader">
                    <div className="child1">
                        <p className="text pointer">Billing Head</p>
                    </div>
                    <div className="child2">
                        <p className="text pointer">Billing Group</p>
                    </div>
                    <div className="child3">
                        <p className="text pointer">Status</p>
                    </div>
                    <div className="child6">
                        <p className="text pointer">Edit</p>
                    </div>
                </div>
                {loading ? <Loading /> : <div className="projectGrid">{renderBillingHeads()}</div>}
            </div>
        </div >
    )
}

export default Billing;
