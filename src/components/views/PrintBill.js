
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
const PrintBill = () => {
    const componentRef = useRef();
    const { billType } = useParams();
    const { billId } = useParams();
    const [bills, setBills] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const viewBills = () => {
        axios.post(`${config.restApiBase}/billing/getBillPDF`)
            .then(response => {
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
                setLoading(false);
                LogException("Unable To Print bill" + error);
                setError("Unable to print Bills Please Contact Tech Team");
            });
    }

    useEffect(() => {
        if (billType && billId)
            viewBills({ billType, billId: billId.split(",") });
    }, [billType])
    return (
        <>
            {bills != null &&
                <>
                    <ReactToPrint
                        trigger={() => <button>Print this out!</button>}
                        content={() => componentRef.current}
                        documentTitle={"Omaxe-Bill-" + billId}
                    />
                    <Bill ref={componentRef} bills={bills} />
                </>
            }
            {error && <div style={{ marginTop: "10%" }} className="error">{error}</div>}
            {loading && <div style={{ marginTop: "10%" }}><Loading /><div style={{ paddingTop: "3%", fontSize: "20px" }} className="success">Fetching Bill...</div></div>}
        </>
    )

}
export default PrintBill;


