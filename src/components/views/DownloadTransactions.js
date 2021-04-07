
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import parse from 'html-react-parser';
import ReactToPrint from 'react-to-print';
import { LogException } from '../../utils/exception';
export class Receipt extends React.PureComponent {
    render() {
        return (<>{this.props.reciepts != null && <>{parse(this.props.reciepts)}</>}</>)
    }
}


const DownloadTransactions = () => {
    const componentRef = useRef();
    const { billId } = useParams();
    const { flatId } = useParams();
    const { transactionId } = useParams();
    console.log(transactionId);
    const [reciepts, setReciepts] = useState(null);
    const [error, setError] = useState("");

    const DownloadURL = `${config.restApiBase}/billing/getTransactions/${billId}/${flatId}/${transactionId != undefined ? transactionId : ""}`;
    const downloadTransactions = () => {
        axios.get(DownloadURL).then(response => {
            let { data } = response;
            console.log(data);
            if (data?.meta?.message) {
                setError("Unable to View Receipts, Cause-" + data?.meta?.message);
                LogException("Unable To Download receipts. Please Contact To Tech-Team", data.error);
            } else {
                setReciepts(data);
            }

            // if (data && data.meta) {
            //     LogException("Unable To Download receipts. Please Contact To Tech-Team");
            // } else {
            //     const url = window.URL.createObjectURL(new Blob([response.data]));
            //     const link = document.createElement('a');
            //     link.href = url;
            //     link.setAttribute('download', `transactions-${billId}.pdf`);
            //     document.body.appendChild(link);
            //     link.click();
            //     link.remove();
            // }
        }).catch((error) => {
            setError("Unable to View Receipts");
            LogException("Unable To Download Transaction" + error);
        });
    }

    useEffect(() => {
        if (billId && flatId)
            downloadTransactions();
    }, [billId])
    return (
        <>
            {reciepts != null &&
                <>
                    <ReactToPrint
                        trigger={() => <button>Print this out!</button>}
                        content={() => componentRef.current}
                    />
                    <Receipt ref={componentRef} reciepts={reciepts} />
                </>
            }
            {error && <div style={{ marginTop: "10%" }} className="error">{error}</div>}
        </>
    )

}
export default DownloadTransactions;


