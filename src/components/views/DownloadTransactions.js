
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import parse from 'html-react-parser';
import ReactToPrint from 'react-to-print';

export class Receipt extends React.PureComponent {
    render() {
        return (<>{this.props.reciepts != null && <>{parse(this.props.reciepts)}</>}</>)
    }
}


const DownloadTransactions = () => {
    const componentRef = useRef();
    const { billId } = useParams();
    const { flatId } = useParams();
    const [reciepts, setReciepts] = useState(null);

    const downloadTransactions = () => {
        axios.get(`${config.restApiBase}/billing/getTransactions/${billId}/${flatId}`).then(response => {
            console.log(response);
            let { data } = response;
            setReciepts(data);
            console.log(data);

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
            //LogException("Unable To Download view bill excel" + error);
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
        </>
    )

}
export default DownloadTransactions;


