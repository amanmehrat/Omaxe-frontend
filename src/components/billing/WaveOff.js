import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoData from "../NoData";
import { LogException } from "../../utils/exception";
import WaveOffGrid from "../grid/WaveOffGrid";
import Loading from "../../components/Loading";
import AuthContext from "../contexts/Auth";
import { useProjectContext } from "../contexts/Project";
import { useGet, usePost } from "../../utils/hooks";
import FileUploader from '../customInputs/FileUploader';
import axios from 'axios';
import config from '../../config';
import cm from "classnames";

const useStyles = makeStyles((theme) => ({
    groups: {
        display: 'inline-block',
    },
    dropdownDiv: {
        display: 'inline-flex',
        flexDirection: 'column',
        float: 'left',
        width: '26%',
        padding: '1.25rem'
    },
    selectDropdown: {
        color: '#495057',
        border: '1px solid #ced4da',
        outline: 'none',
        fontSize: '14px',
        padding: '12px',
        borderRadius: '6px',
        width: '92%'
    },
    selectInputDiv: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    formBorder: {
        border: '1px solid rgba(211,211,211,0.3)',
        padding: '12px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: "center"
    },
    btnGroups: {
        width: '22%',
        display: 'inline-flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem'
    },
    fileUploader: {
        display: 'flex',
        flexDirection: 'column',
        width: '22%',
        padding: '1.1rem'
    },
    autocomplete: {
        width: '25%',
        padding: '1.1rem'
    },
    amountDiv: {
        display: 'flex',
        flexDirection: 'column',
        width: '25%',
        padding: '1.1rem'
    },
}));
const WaveOff = () => {
    const classes = useStyles();

    const { selectedProjectId } = useProjectContext();
    const [loading, setLoading] = useState(false);
    const [isloadWaveOffs, setIsloadWaveOffs] = useState(true);
    const [waveOffs, setWaveOffs] = useState(null);
    const [duesData, setDuesData] = useState(null);
    const [flatList, setFlatList] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [billId, setBillId] = useState("")
    const [flatNo, setFlatNo] = useState("")
    const [billType, setBillType] = useState(-1)
    const [amount, setAmount] = useState("");
    const [file, setFile] = useState(null);
    const [dueMessage, setDueMessage] = useState("");

    const { user } = useContext(AuthContext);

    const onSelectFile = (event) => {
        setFile(event.target.files[0]);
    }

    const { run: getWaveOffs } = useGet("/billing/waiveOff/" + selectedProjectId, null,
        {
            onResolve: (data) => {
                setIsloadWaveOffs(false);
                if (data?.waiveOffData) {
                    setWaveOffs(data.waiveOffData);
                } else {
                    //errorCtx.setError("Unable To fetch Transactions");
                    LogException("Unable To fetch WaveOffs", data);
                }
                setLoading(false);
            },
            onReject: (err) => {
                LogException("Unable To fetch WaveOffs", err);
                setIsloadWaveOffs(false);
            }
        });
    const { run: getFlatsList } = useGet("/flats/" + selectedProjectId, null,
        {
            onResolve: (data) => {
                if (data?.flatNumbers != undefined) {
                    data.flatNumbers = data.flatNumbers.map(item => ({ flatNumber: item }))
                    setFlatList(data.flatNumbers);
                }
            },
            onReject: (err) => {
                LogException("Unable To get Flat List", err);
            }
        });
    const { run: getDues } = usePost("/flats/getFlatDues", null,
        {
            onResolve: (data) => {
                if (data?.flatDues != undefined) {
                    let duesArray = [];
                    data.flatDues.forEach(element => {
                        duesArray.push(element?.CAMHistories);
                        duesArray.push(element?.electricityHistories);
                    });
                    setDuesData(duesArray);
                }
            },
            onReject: (err) => {
                LogException("Unable To get Dues For flat", err);
            }
        });
    useEffect(() => {
        if (isloadWaveOffs) {
            getWaveOffs();
        }
    }, [isloadWaveOffs]);

    useEffect(() => {
        getFlatsList();
    }, []);

    useEffect(() => {
        if (flatNo?.flatNumber)
            getDues({ projectId: selectedProjectId, flatNumber: flatNo.flatNumber });
    }, [flatNo]);

    useEffect(() => {
        if (billType != -1 && duesData != null) {
            setDueMessage("");
            setBillId("");
            switch (parseInt(billType)) {
                case 1:
                    if (duesData[0][0]?.dueAmount != undefined) {
                        setBillId(duesData[0][0]?.id);
                        setDueMessage("Due Amount -" + duesData[0][0]?.dueAmount);
                    } else {
                        setDueMessage("No Dues/Bills found");
                    }
                    break;
                case 2:
                    if (duesData[1][0]?.dueAmount != undefined) {
                        setBillId(duesData[1][0]?.id);
                        setDueMessage("Due Amount -" + duesData[1][0]?.dueAmount);
                    } else {
                        setDueMessage("No Dues/Bills found");
                    }
                    break;
            }
        }
    }, [billType]);

    const validateWaveOff = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setSuccess("");
        setError("");
        if (billId == "") {
            setError("Please Choose Property No and BilllingType");
        } else if (billType == "-1") {
            setError("Please Choose Billing Type");
        } else if (amount == "0") {
            setError("Please Enter Amount");
        } else if (!file) {
            setError("Please Choose File");
        } else {
            addWaveOff();
        }
    }
    const addWaveOff = () => {
        let formData = new FormData();
        formData.append("doc", file);
        formData.append("billId", billId);
        formData.append("createdBy", user.id);
        formData.append("amount", amount);
        formData.append("billType", billType);
        setLoading(true);
        axios.post(`${config.restApiBase}/billing/addWaiveOff`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        ).then(response => {
            setLoading(false);
            let { data } = response;
            if (!(data && data.meta))
                setError("Unable to add WaveOff");
            if (data.meta.code >= 200 && data.meta.code < 300) {
                setIsloadWaveOffs(true);
                setFile(null);
                setAmount("");
                setSuccess("Wave-Off Added Successfully");
            } else {
                setError("Unable to add WaveOff");
            }
        }).catch((error) => {
            setLoading(false);
            setError("Unable to add WaveOff");
        });
    };
    const renderWaveOffs = () => {
        if (loading) {
            return <Loading />
        } if (waveOffs == null) {
            return "";
        } else if (waveOffs && waveOffs.length > 0) {
            return <WaveOffGrid waveOffs={waveOffs} />
        } else {
            return <NoData text="No WaveOffs Found" />;
        }
    }
    return (
        <div className="project">
            <div className="project__header">
                <div className="project__body--heading">Wave-Off</div>
                <div className="project__header--filter">
                    <Link to='/billing/viewbills' className="project__header--filter--button">View Bills</Link>
                </div>
            </div>
            <div className="project__body">
                <div className="project__body--content">
                    <div className="project__body--contentBody">
                        <form className={cm(classes.formBorder, "ProjectForm")} onSubmit={e => validateWaveOff(e)}>
                            <div className={cm(classes.autocomplete, "")}>
                                <Autocomplete
                                    options={flatList}
                                    getOptionLabel={(option) => option.flatNumber}
                                    onChange={(event, newValue) => {
                                        setFlatNo(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Property No" variant="outlined" />}
                                />
                                <div className="success">{dueMessage}</div>
                            </div>
                            <div className={cm(classes.dropdownDiv)}>
                                <select name="billType" onChange={(e) => setBillType(e.target.value)} className={cm(classes.selectDropdown, "input-text")} defaultValue={billType} >
                                    <option value="-1">Choose Bill Type</option>
                                    <option value="1">Cam</option>
                                    <option value="2">Electricity</option>
                                </select>
                            </div>
                            <div className={cm(classes.amountDiv, "")}>
                                <input
                                    placeholder="Amount"
                                    type="number"
                                    className="input-text wid100"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className={cm(classes.fileUploader, "")}>
                                <label className="input-label">Document</label>
                                <FileUploader
                                    selectedFile={file}
                                    onSelectFile={onSelectFile}
                                    accept={null}
                                />
                            </div>
                            <div className={classes.btnGroups}>
                                <button className={cm("project__header--filter--button materialBtn")} type="submit">
                                    Add Wave-Off
                                </button>
                            </div>
                        </form>
                        {error && <div className="error">{error}</div>}
                        {success && <div className="success">{success}</div>}
                        {loading ? <Loading /> : renderWaveOffs()}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default WaveOff;
