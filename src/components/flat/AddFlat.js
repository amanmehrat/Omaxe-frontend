import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker } from '@material-ui/pickers';

import React, { useState, useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import cm from "classnames";

import Loading from "../../components/Loading";

import { LogException } from "../../utils/exception";
//import './AddFlat.css'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MyTextInput from '../../components/customInputs/MyTextInput';
import MyCheckBox from '../../components/customInputs/MyCheckBox';

import { errorContext } from "../contexts/error/errorContext";
import { useProjectContext } from "../contexts/Project";
import { useGet, usePost, usePut } from "../../utils/hooks";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


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
        dateOfPossession: new Date(),
        meterNumber: "",
        hasLift: true,
        hasDG: true,
        sameOwner: false,
        ownerEmail: "",
        ownerContact: "",
        residentEmail: "",
        residentContact: "",
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
                //setStartDate(new Date(requiredFlat?.dateOfPossession));
                requiredFlat.ownerName = requiredFlat.ownerName == null ? "" : requiredFlat.ownerName;
                requiredFlat.residentName = requiredFlat.residentName == null ? "" : requiredFlat.residentName;
                requiredFlat.ownerEmail = requiredFlat.ownerEmail == null ? "" : requiredFlat.ownerEmail;
                requiredFlat.residentEmail = requiredFlat.residentEmail == null ? "" : requiredFlat.residentEmail;
                requiredFlat.ownerContact = requiredFlat.ownerContact == null ? "" : requiredFlat.ownerContact;
                requiredFlat.residentContact = requiredFlat.residentContact == null ? "" : requiredFlat.residentContact;

                setFlat(requiredFlat);
                setLoading(false);
            },
            onReject: (err) => {
                LogException("Unable To get Flat By Id", err);
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
                errorCtx.setSuccess("Property Saved Successfully");
                setIsReset(true);
                history.push("/flat/add");
            },
            onReject: (err) => {
                LogException("Unable To Create Property", err);
                errorCtx.setError(err);
            }
        });

    const { run: UpdateFlat } = usePost("/flats/updateFlat",
        null,
        {
            onResolve: (data) => {
                console.log("update", selectedProjectId);
                errorCtx.setSuccess("Property Updated Successfully");
            },
            onReject: (err) => {
                LogException("Unable To Update Property", err);
                errorCtx.setError(err);
            }
        });

    const SaveFlat = (values, setSubmitting, resetForm) => {
        delete values["sameOwner"];
        if (isEdit) {
            console.log("values", values);
            const updatedProjectId = selectedProjectId;
            delete values["projectId"];
            //values.dateOfPossession = startDate;
            let updatedFlat = { projectId: updatedProjectId, flat: values };
            //values.projectId = updatedProjectId;
            UpdateFlat(updatedFlat);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
        } else {
            //values.createdBy = user.id;
            //values.dateOfPossession = startDate;
            let insertedProject = {
                projectId: selectedProjectId,
                flats: [values]
            }
            CreateFlat(insertedProject);
            setTimeout(() => {
                setSubmitting(false);
            }, 400);
            resetForm();
        }
    }

    useEffect(() => {
        if (isReset) {
            setFlat(FlatStructure);
        }
    }, [isReset])
    const handleSameOwner = (e, values, setFieldValue) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            setFieldValue('residentName', values.ownerName);
            setFieldValue('residentEmail', values.ownerEmail);
            setFieldValue('residentContact', values.ownerContact);
        } else {
            setFieldValue('residentName', "");
            setFieldValue('residentEmail', "");
            setFieldValue('residentContact', "");
        }

    }
    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">{isEdit ? "Edit" : "Add"} Property</div>
                <div className="project__header--filter">
                    <Link className="project__header--filter--button" to={"/Project/" + selectedProjectId} >View All properties</Link>
                </div>
            </div>
            <div className="project__body">
                {
                    loading ? <Loading /> :
                        <>
                            <Formik
                                enableReinitialize={true}
                                validateOnMount={true}
                                initialValues={flat}
                                validationSchema={Yup.object({
                                    residentName: Yup.string()
                                        .required('Required'),
                                    ownerName: Yup.string()
                                        .required('Required'),
                                    flatNumber: Yup.string()
                                        .required('Required'),
                                    floorNumber: Yup.string()
                                        .required('Required'),
                                    blockNumber: Yup.string()
                                        .required('Required'),
                                    area: Yup.string()
                                        .required('Required'),
                                    blockIncharge: Yup.string()
                                        .required('Required'),
                                    dateOfPossession: Yup.string()
                                        .required('Required'),
                                    meterNumber: Yup.string()
                                        .required('Required'),
                                    ownerEmail: Yup.string()
                                        .email("Invalid Email")
                                        .required('Required'),
                                    ownerContact: Yup.string()
                                        .matches(phoneRegExp, 'Invalid PhoneNumber')
                                        .required('Required'),
                                    residentEmail: Yup.string()
                                        .email("Invalid Email")
                                        .required('Required'),
                                    residentContact: Yup.string()
                                        .matches(phoneRegExp, 'Invalid PhoneNumber')
                                        .required('Required')
                                })}
                                onSubmit={(values, { setSubmitting }, resetForm) => {
                                    SaveFlat(values, setSubmitting, resetForm);
                                }}
                                onReset={() => { return FlatStructure; }}
                            >
                                {props => {
                                    const {
                                        isSubmitting,
                                        setFieldValue,
                                        handleChange,
                                        values,
                                        touched,
                                        errors
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
                                                                <option value="1">1 BHK</option>
                                                                <option value="2">2 BHK</option>
                                                                <option value="3">3 BHK</option>
                                                                <option value="4">4 BHK</option>
                                                                <option value="5">ENTIRE BUILDING</option>
                                                                <option value="7">VILLA</option>
                                                                <option value="20">PLOT</option>
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
                                                                    value={values.dateOfPossession}
                                                                    id="date-picker-inline"
                                                                    name="dateOfPossession"
                                                                    onChange={date => { setFieldValue('dateOfPossession', date.format("yyyy-MM-DD")) }}
                                                                    autoOk
                                                                />
                                                            </MuiPickersUtilsProvider>
                                                            {
                                                                touched.dateOfPossession && errors.dateOfPossession ? (
                                                                    <div className="errorLabel">{errors.dateOfPossession}</div>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label="Property Number"
                                                            name="flatNumber"
                                                            type="text"
                                                            placeholder="Property Number"
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
                                                    <div className="formSubHeading"><b>Owner Details :</b></div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label=""
                                                            name="ownerName"
                                                            type="text"
                                                            placeholder="Owner Name"
                                                            className="input-text wid100"
                                                        />
                                                        <MyTextInput
                                                            label=""
                                                            name="ownerContact"
                                                            type="text"
                                                            placeholder="Owner Contact"
                                                            className="input-text wid100"
                                                        />
                                                        <MyTextInput
                                                            label=""
                                                            name="ownerEmail"
                                                            type="text"
                                                            placeholder="Owner Email"
                                                            className="input-text wid100"
                                                        />
                                                    </div>
                                                    <div className="formSubHeading"><b>Resident Details </b>
                                                        <input type="checkbox" name="sameOwner" onChange={(e) => handleSameOwner(e, values, setFieldValue)} style={{ verticalAlign: 'middle', marginRight: '0.26rem' }} />
                                                        (Same as Owner Details)
                                                   </div>
                                                    <div className="row">
                                                        <MyTextInput
                                                            label=""
                                                            name="residentName"
                                                            type="text"
                                                            placeholder="Resident Name"
                                                            className="input-text wid100"
                                                        />
                                                        <MyTextInput
                                                            label=""
                                                            name="residentContact"
                                                            type="text"
                                                            placeholder="Resident Contact"
                                                            className="input-text wid100"
                                                        />
                                                        <MyTextInput
                                                            label=""
                                                            name="residentEmail"
                                                            type="text"
                                                            placeholder="Resident Email"
                                                            className="input-text wid100"
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

export default AddFlat;
