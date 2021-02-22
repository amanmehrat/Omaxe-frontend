import { useField } from 'formik';
import React from "react";

const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className="form-group col-12">
            <label htmlFor={props.id || props.name}>{label}</label>
            <select className="form-control" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error text-danger">{meta.error}</div>
            ) : null}
        </div>
    );
};

export default MySelect;