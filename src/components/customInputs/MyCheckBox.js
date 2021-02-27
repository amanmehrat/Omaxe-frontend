import { useField } from 'formik';
import React from "react";

const MyCheckBox = ({ children, ...props }) => {
    // React treats radios and checkbox inputs differently other input types, select, and textarea.
    // Formik does this too! When you specify `type` to useField(), it will
    // return the correct bag of props for you
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    return (
        <div className="form-group" style={{ marginTop: '0.22rem' }}>
            <label className="form-check-label" style={{ wordWrap: 'break-word', fontSize: '1.6rem' }}>
                <input type="checkbox" style={{ verticalAlign: 'middle', marginRight: '0.26rem' }} {...field} {...props} />
                {children}
            </label>
            {meta.touched && meta.error ? (
                <div className="error text-danger">{meta.error}</div>
            ) : null}
        </div>
    );
};
export default MyCheckBox