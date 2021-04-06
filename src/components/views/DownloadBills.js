
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import parse from 'html-react-parser';
import ReactToPrint from 'react-to-print';
import { LogException } from '../../utils/exception';
import Loading from '../Loading';
export class Bill extends React.PureComponent {
    render() {
        return (<>{this.props.bills != null && <>{parse(this.props.bills)}</>}</>)
    }
}
const DownloadBills = () => {
    const componentRef = useRef();
    const { billType } = useParams();
    const billIds = localStorage.getItem("downloadBillIds").split(",");
    const [bills, setBills] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const printBills = () => {
        setError("");
        let printRequest = { billType: parseInt(billType), billId: billIds };
        axios.post(`${config.restApiBase}/billing/getBillPDF`, printRequest).then(response => {
            console.log(response);
            setLoading(false);
            let { data } = response;
            let dataResponse = data.data;
            if (dataResponse.message != undefined) {
                setBills(dataResponse.message);
            } else {
                let viewBillError = ""
                if (dataResponse.error != undefined) {
                    viewBillError = dataResponse.error;
                    LogException("Unable To Print bills, Cause - " + dataResponse);
                }
                setError("Unable to print Bills " + viewBillError);
            }
        }).catch((error) => {
            console.log(error);
            setLoading(false);
            LogException("Unable To Print bills" + error);
            setError("Unable to print Bills Please Contact Tech Team");
        });
    }

    useEffect(() => {
        if (billType && billIds != null && billIds.length > 0)
            printBills();
    }, [billType])
    return (
        <>
            {bills != null &&
                <>
                    <ReactToPrint
                        trigger={() => <button>Print this out!</button>}
                        content={() => componentRef.current}
                    />
                    <Bill ref={componentRef} bills={bills} />
                </>
            }
            {error && <div style={{ marginTop: "10%" }} class="error">{error}</div>}
            {loading && <div style={{ marginTop: "10%" }}><Loading /><div style={{ paddingTop: "3%", fontSize: "20px" }} class="success">Fetching Bill...</div></div>}
        </>
    )

}
export default DownloadBills;


