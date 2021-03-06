import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';

import React, { useState, useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import cm from "classnames";

import Loading from "../../components/Loading";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import './AddFlat.css'


import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MyTextInput from '../../components/customInputs/MyTextInput';
import MyCheckBox from '../../components/customInputs/MyCheckBox';

import { errorContext } from "../contexts/error/errorContext";
import { useProjectContext } from "../contexts/Project";
import AuthContext from "../contexts/Auth";
import { useGet, usePost, usePut } from "../../utils/hooks";


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
}));

const AddFlat = () => {
    const FlatStructure = {
        propertyType: -1,
        residentName: "",
        ownerName: "",
        flatNumber: "",
        floorNumber: "",
        blockNumber: "",
        area: "",
        blockIncharge: "",
        dateOfPossession: "",
        meterNumber: "",
        hasLift: true,
        hasDG: true
    }
    const classes = useStyles();
    const { flatId } = useParams();
    const history = useHistory();
    const errorCtx = useContext(errorContext);
    const { selectedProjectId } = useProjectContext();
    console.log(selectedProjectId);
    if (!selectedProjectId) history.push("/projects");

    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const { user } = useContext(AuthContext);
    const [startDate, setStartDate] = useState(null);
    const [flat, setFlat] = useState(FlatStructure);

    const { run: getFlatById } = usePost("/flats/getFlat", null,
        {
            onResolve: (data) => {
                let requiredFlat = data?.flat;
                console.log(requiredFlat);
                delete requiredFlat["CAMHistories"];
                delete requiredFlat["electricityHistories"];
                //requiredFlat.hasDG = true;
                //requiredFlat.hasLift = true;
                setStartDate(new Date(requiredFlat?.dateOfPossession));
                setFlat(requiredFlat);
                setLoading(false);
            },
            onReject: (err) => {
                errorCtx.setError(err);
                setLoading(false);
            }
        });


    useEffect(() => {
        if (flatId) {
            setLoading(true);
            setIsEdit(true);
            getFlatById({ flatId: flatId });
        }
    }, [flatId]);


    const { run: CreateFlat } = usePost("/flats/addFlats",
        null,
        {
            onResolve: (data) => {
                errorCtx.setSuccess("Flat Saved Successfully");
                setIsReset(true);
                history.push("/flat/add");
            },
            onReject: (err) => {
                errorCtx.setError(err);
            }
        });

    const { run: UpdateFlat } = usePost("/flats/updateFlat",
        null,
        {
            onResolve: (data) => {
                console.log("update", selectedProjectId);
                errorCtx.setSuccess("Flat Updated Successfully");
                history.push("/flat/edit/" + flatId);
            },
            onReject: (err) => {
                errorCtx.setError(err);
            }
        });

    const SaveFlat = (values, setSubmitting) => {
        if (isEdit) {
            console.log("values", values);
            const updatedProjectId = selectedProjectId;
            delete values["projectId"];
            values.dateOfPossession = startDate;
            let updatedFlat = { projectId: updatedProjectId, flat: values };
            //values.projectId = updatedProjectId;
            UpdateFlat(updatedFlat);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        } else {
            //values.createdBy = user.id;
            values.dateOfPossession = startDate;
            let insertedProject = {
                projectId: selectedProjectId,
                flats: [values]
            }
            CreateFlat(insertedProject);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        }
    }

    useEffect(() => {
        if (isReset) {
            setFlat(FlatStructure);
        }
    }, [isReset])

    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">{isEdit ? "Edit" : "Add"} Flat</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/Project/" + selectedProjectId} >View All Flats</Link>
                </div>
            </div>
            <div className="project__body">
                {
                    loading ? <Loading /> :
                        <>
                            <Formik
                                enableReinitialize
                                validateOnMount={true}
                                initialValues={flat}
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
                                    //startedOn: Yup.string()
                                    //    .required('Required')
                                })}
                                onSubmit={(values, { setSubmitting }) => {
                                    SaveFlat(values, setSubmitting);
                                }}
                                onReset={() => { setStartDate(null); return FlatStructure; }}
                            >
                                {props => {
                                    const {
                                        isSubmitting,
                                        setFieldValue,
                                        handleChange,
                                        values
                                    } = props;
                                    return (
                                        <div className="project__body--content">
                                            <div className="project__body--contentBody">
                                                <Form className="ProjectForm">
                                                    <div className="row">
                                                        <div className="form-group">
                                                            <label className="input-label">Property Type</label>
                                                            <select name="propertyType" defaultValue={flat.propertyType} onChange={handleChange} className={cm(classes.selectDropdown, "input-text")} >
                                                                <option value="-1">Choose PropertyType</option>
                                                                <option value="0">3 BHK</option>
                                                                <option value="1">Others</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="input-label">Possession Date</label>
                                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                                <KeyboardDatePicker
                                                                    className="input-text"
                                                                    variant="inline"
                                                                    format="DD-MM-YYYY"
                                                                    margin="normal"
                                                                    id="date-picker-inline"
                                                                    name="dateOfPossession"
                                                                    value={startDate}
                                                                    onChange={date => { setStartDate(date); }}
                                                                    autoOk
                                                                />
                                                            </MuiPickersUtilsProvider>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="Owner Name"
                                                            name="ownerName"
                                                            type="text"
                                                            placeholder="Owner Name"
                                                            className="input-text"
                                                        />
                                                        <MyTextInput
                                                            label="Resident Name"
                                                            name="residentName"
                                                            type="text"
                                                            placeholder="Resident Name"
                                                            className="input-text"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="Flat Number"
                                                            name="flatNumber"
                                                            type="text"
                                                            placeholder="Flat Number"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="Floor Number"
                                                            name="floorNumber"
                                                            type="text"
                                                            placeholder="Floor Number"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="Area"
                                                            name="area"
                                                            type="number"
                                                            placeholder="Area"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="Block Number"
                                                            name="blockNumber"
                                                            type="Text"
                                                            placeholder="Block Number"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="Block Incharge"
                                                            name="blockIncharge"
                                                            type="text"
                                                            placeholder="Block Incharge"
                                                            className="input-text wid50"
                                                        />
                                                        <MyTextInput
                                                            label="Meter Number"
                                                            name="meterNumber"
                                                            type="text"
                                                            placeholder="Meter Number"
                                                            className="input-text wid50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <MyCheckBox name="hasLift">
                                                            Is Lift Present
                                                        </MyCheckBox>
                                                        <MyCheckBox name="hasDG">
                                                            Is DG Present
                                                        </MyCheckBox>
                                                    </div>
                                                    <div className="row btn-group">
                                                        <button disabled={isSubmitting} className={cm("blue_button", "dbutton", "editUp", "btn")} type="submit">
                                                            {isEdit ? "Update" : "Save"}
                                                        </button>
                                                        <button className={cm("grey_button", "dbutton", "btn")} type="reset">Cancel</button>
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
    )
}

export default AddFlat;
