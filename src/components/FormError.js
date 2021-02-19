import React from 'react';

import {accessByKey} from '../utils/object';


const isJoiError = (error) => accessByKey(error, 'error.isJoi') || error.isJoi;

const getMessage = (frontendError, backendError) => {
  // (0) no errors
  if (!frontendError && !backendError) return false;

  // (1) if there is a frontendError, throw it first
  if (frontendError && isJoiError(frontendError)) return frontendError.details[0].message;

  // (2) check for backend Joi error
  if (backendError && isJoiError(backendError)) return backendError.error.details[0].message;

  // (3) backend api errors
  if (backendError && backendError.msg) return backendError.msg;

  // hyper generic in case the app fucks up
  return "An error occured, please try again."; 
};

const FormError = ({frontendError, backendError}) => {
  const message = getMessage(frontendError, backendError);
  return (message && <div className="errorMsg">
    {message}
  </div>);
};

export default FormError;