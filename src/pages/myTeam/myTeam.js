import React, { useState, useContext, useEffect } from 'react';
import Select from "react-select";
import cm from "classnames";

import { useGet, usePost, usePut } from "../../utils/hooks";
import { errorContext } from "../../components/contexts/error/errorContext";
import NoData from "../../components/NoData";
import Loading from "../../components/Loading";
import search from "../../img/search.svg";
import plusBlue from "../../img/plus-blue.svg";
import unDraw from "../../img/undraw.svg";
import eye_black from "../../img/lock.svg";
import eye from "../../img/unlock.svg";
import pencil_black from "../../img/pencil_black.svg";
import "./myTeam.scss";

const MyTeam = ({ history }) => {


    const [selectedMember, setSelectedMember] = useState(null);
    const [newUser, setNewUser] = useState(false);
    const [edit, setEdit] = useState(false);
    const errorCtx = useContext(errorContext);
    const [team, setTeam] = useState(null)
    const [loadGetData, setLoadGetData] = useState(true);
    const [loading, setLoading] = useState(true)

    const [name, setName] = useState("");
    const [id, setId] = useState(null);
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("member");
    const [success, setSuccess] = useState(false);

    const { run: CreateMember } = usePost("/user",
        { name, email, phoneNumber, password, role },
        {
            onResolve: (data) => {
                errorCtx.setSuccess("Member added");
                setSuccess(true);
                setLoadGetData(true);
            },
            onReject: (err) => {
                errorCtx.setError(err);
            }
        });
    const { run: UpdateMember } = usePut("/user/" + id,
        null,
        {
            onResolve: (data) => {
                console.log("ERROR");
                errorCtx.setSuccess("Member Updated");
                setSuccess(true);
                setLoadGetData(true);
            },
            onReject: (err) => {
                console.log("ERROR");
                errorCtx.setError(err);
            }
        });
    const { run: updateTeamList } = useGet("/user", null,
        {
            onResolve: (data) => {
                setTeam(data.user);
                setLoading(false);
            },
            onReject: (error) => {
                console.log("error ------", error);
            }
        });

    const submitHandler = (e) => {
        e.preventDefault();
        if (newUser) {
            CreateMember();
        } else {
            UpdateMember({ name, email, phoneNumber, password, role, isDisable: selectedMember.isDisable });
        }
    }

    const addMember = (id) => {
        resetMember();
        if (id) {
            let member = team.find(teamObject => teamObject.id == id);
            member.role = !member.role ? "member" : member.role
            setSelectedMember(member);
            setName(member.name);
            setId(member.id);
            setEmail(member.email);
            setPhoneNumber(member.phoneNumber);
            setPassword(member.password);
            setRole(member.role);
        }
        setEdit(true);
    }

    const resetMember = () => {
        setId(null);
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setRole("member");
        setSelectedMember({
            id: null,
            name: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: "member",
            isDisableMember: "",
        });
    }
    useEffect(() => {
        setLoadGetData(false);
        updateTeamList();
    }, [loadGetData]);

    useEffect(() => {
        setSuccess(false);
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setRole("member");
    }, [success])

    return (
        <div className="myTeam">
            <div className="midContainer">
                <div className="midContainer__head">

                    <div className="midContainer__head--field">
                        <img
                            src={search}
                            alt="search"
                            className="midContainer__head--field--search"
                        />
                        <input
                            onChange={(e) => console.log(e.target.value)}
                            type="text"
                            placeholder="search"
                            className="midContainer__head--field--input"
                        />
                    </div>

                </div>
                <div className="midContainer__body">
                    {
                        loading ? <Loading /> : (Object.keys(team).length ?
                            (Object.keys(team).map((key) => {
                                let { id, name, email, phoneNumber, role, isDisable } = team[key]
                                return (
                                    <div className={cm("contentMid", { "contentMid__active": false })}
                                        onClick={() => {
                                            addMember(id)
                                            setEdit(true)
                                        }}
                                    >
                                        <div className="text1 ">
                                            <p className="text pointer">{name}</p>
                                        </div>
                                        <div className="text2">
                                            <p className="text pointer">{email}</p>
                                        </div>
                                        <div className="text3">
                                            <p className="text pointer">{phoneNumber}</p>
                                        </div>
                                        <div className="text4">
                                            <p className="text pointer">{role === "admin" ? "Admin" : "Member"}</p>
                                        </div>

                                        <div className="text5">
                                            <img src={isDisable ? eye_black : eye} alt={"search"}
                                                className="iconText pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    errorCtx.setWarning(`
                                                         This will This action will 
                                                         ${isDisable ? "allow" : "prevent"} 
                                                         your team member 
                                                         ${isDisable ? "to" : "from"} 
                                                         logging in to the system and use it
                                                         `, () => {
                                                        console.log("You want to diable", id);
                                                        //disableMember(id, !isDisable)
                                                    }, () => {
                                                    })

                                                }} />
                                            <img src={pencil_black} alt={"edit"} className="icon pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    console.log("Want to update user ----", id);
                                                    addMember(id);
                                                    setEdit(true)
                                                }} />
                                        </div>

                                    </div>
                                )

                            })
                            )
                            : <NoData />)
                    }
                </div>
                <div className="midContainer__button">
                    <button className="midContainer__button--btn" onClick={() => {
                        setEdit(true)
                        addMember()
                    }}>
                        <img src={plusBlue} alt="plusBlue" className="midContainer__button--btn--img" />
                    </button>
                </div>
            </div>

            {edit &&
                <div className="rightContainer">
                    <>
                        <div className="detail">
                            <div className="dhead dheadActive">
                                <p className="dback pointer" onClick={() => { setSelectedMember(null); setEdit(false); }}><b>&#10094;&nbsp; Back</b></p>
                            </div>
                            <div className="editContent">
                                <p className="editText">
                                    {id ? "Edit" : "Add"} team member's details</p>
                                <form className="editContentForm" onSubmit={submitHandler}>
                                    <div className="editForm">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Name"
                                            value={name}
                                            className="editInput"
                                            onChange={(e) => setName(e.target.value)}
                                        /></div>

                                    <div className="editForm">
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            value={email}
                                            className="editInput"
                                            onChange={(e) => setEmail(e.target.value)}
                                        /></div>

                                    <div className="editForm">
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="Phone Number"
                                            value={phoneNumber}
                                            className="editInput"
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        /></div>
                                    {!id &&
                                        <div className="editForm">
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                value={password}
                                                className="editInput"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    }
                                    <div className="editForm">
                                        <Select isSearchable={false}
                                            styles={{
                                                control: (styles, state) => ({
                                                    ...styles, backgroundColor: '#eee', width: "100%", padding: "0.5rem 2rem", border: state.isFocused ? 0 : 0,
                                                    // This line disable the blue border
                                                    boxShadow: state.isFocused ? 0 : 0,
                                                    '&:hover': {
                                                        border: state.isFocused ? 0 : 0
                                                    }
                                                }),
                                                // option: styles => ({ ...styles, width:"90%",padding:"0.5rem 2rem" }),
                                                menu: styles => ({ ...styles, width: "100%" }),
                                            }}
                                            value={{ value: role, label: (role === "member" ? "Team Member" : "Admin") }}
                                            onChange={(e) => { setRole(e.value); }}
                                            options={[
                                                { value: "member", label: "Team Member" },
                                                { value: "admin", label: "Admin" },
                                            ]} />
                                    </div>
                                    <button className={cm("blue_button", "dbutton", "editUp", "btn")} type="submit">
                                        {id ? "Update" : "Save"}
                                    </button>
                                    <button className={cm("grey_button", "dbutton", "btn")}
                                        type={"button"}
                                        onClick={() => {
                                            setSelectedMember(null)
                                            setEdit(false)
                                        }}
                                    >
                                        cancel
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                </div>
            }

            {!edit && <div className="rightContainerEmpty">
                <p className="editText"> Select view or edit</p>
                <img src={unDraw} alt={"search"} className="image" />
            </div>}
        </div>
    )
}

export default MyTeam;