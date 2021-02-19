import React, {useContext, useState} from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import "./error.scss";
// import {userContext} from "../user/userContext";

export const errorContext = React.createContext({});

const ErrorContext = (props) => {
  // const userCtx = useContext(userContext)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [warning, setWarning] = useState(null);
  return (
    <errorContext.Provider
      value={{
        setError: (error) => {
          setError(error);
        },
        setSuccess: (msg,props={}) => {
          setSuccess({msg,...props});
        },
        setWarning: (msg, onConfirm, onCancel) => {
          setWarning({
            msg,
            onCancel,
            onConfirm,
          });
        },
      }}
    >
      {error && (
        <div className={"errorDialog"}>
          <SweetAlert
            warning
            confirmBtnText={error.code in [4025,403]?"Logout":"OK"}
            onConfirm={() => {
                if(error.code in [4025,403]){
                    // userCtx.logout();
                }
                setError(null)
            }}
            title="Error"
            focusConfirmBtn
          >
               <div className="message">
            {error.message}
            </div>
          </SweetAlert>
        </div>
      )}
      {success && (
        <div className={"successDialog"}>
          <SweetAlert
            success
            title="Success!"
            onConfirm={() => setSuccess(null)}
          >
               <div className="message">
                            {success.msg}
                            </div>
          </SweetAlert>
        </div>
      )}
      {warning && (
        <div className={"warningDialog"}>
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Confirm"
            title="Are you sure?"
            onConfirm={() => {
              warning.onConfirm();
              setWarning(null);
            }}
            onCancel={() => {
              warning.onCancel();
              setWarning(null);
            }}
            focusCancelBtn
          >
            
            <div className="message">
             {warning.msg}
             </div>
          </SweetAlert>
        </div>
      )}
      {props.children}
    </errorContext.Provider>
  );
};

export default ErrorContext;
