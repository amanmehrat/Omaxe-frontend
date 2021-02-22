import { useField } from 'formik';
import React from "react";

const MyTextArea = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField(props);
    return (
        <div className="form-group col-12">
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea className="form-control" {...field} {...props} ></textarea>
            {meta.touched && meta.error ? (
                <div className="error text-danger">{meta.error}</div>
            ) : null}
        </div>
    );
};
export default MyTextArea