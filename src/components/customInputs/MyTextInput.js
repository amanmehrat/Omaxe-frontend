import { useField } from 'formik';
import React from "react";

const MyTextInput = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField(props);
    return (
        <div className="form-group">
            {
                label != "" && <label className="input-label" htmlFor={props.id || props.name}>{label}</label>
            }
            <input {...field} {...props} autoComplete="off" />
            {
                meta.touched && meta.error ? (
                    <div className="errorLabel">{meta.error}</div>
                ) : null
            }
        </div>
    );
};
export default MyTextInput;