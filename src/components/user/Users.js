import React, { useState, useContext, useEffect } from 'react';
import Select from "react-select";
import cm from "classnames";

import { LogException } from '../../utils/exception';
import { useGet, usePost, usePut } from "../../utils/hooks";
import { errorContext } from "../../components/contexts/error/errorContext";
import NoData from "../../components/NoData";
import Loading from "../../components/Loading";
import unDraw from "../../img/undraw.svg";
import eye_black from "../../img/lock.svg";
import eye from "../../img/unlock.svg";
import pencil_black from "../../img/pencil_black.svg";
import "./Users.scss";
import Search from "../customInputs/Search";

const Users = () => {

    const [searchText, setSearchText] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [edit, setEdit] = useState(false);
    const errorCtx = useContext(errorContext);
    const [team, setTeam] = useState(null)
    const [oldTeam, setOldTeam] = useState(null)
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
                LogException("Unable to create user", err);
                errorCtx.setError(err);
            }
        });
    const { run: UpdateMember } = usePut("/user/" + id,
        null,
        {
            onResolve: (data) => {
                errorCtx.setSuccess("Member Updated");
                setSuccess(true);
                setLoadGetData(true);
            },
            onReject: (err) => {
                LogException("Unable to update user", err);
                errorCtx.setError(err);
            }
        });
    const { run: updateTeamList } = useGet("/user", null,
        {
            onResolve: (data) => {
                setTeam(data.user);
                setOldTeam(data.user);
                setLoading(false);
            },
            onReject: (err) => {
                LogException("Unable to get users", err);
                setLoading(false);
            }
        });

    const submitHandler = (e) => {
        e.preventDefault();
        if (edit && id == null) {
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
            isDisable: "",
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

    useEffect(() => {
        setLoading(true);
        searchUsers();
    }, [searchText]);

    const searchUsers = () => {
        const searchValue = searchText;
        let newUsers = [];
        if (searchValue == "") {
            newUsers = oldTeam;
        } else {
            newUsers = oldTeam?.filter(obj => {
                return obj.name.toUpperCase().includes(searchValue.toUpperCase());
            });
        }
        setTeam(newUsers);
        setLoading(false);
    }

    const renderUsers = () => {
        if (team && team.length > 0) {
            return [
                team.map(teamMember => {
                    let { id, name, email, phoneNumber, role, isDisable } = teamMember;
                    return (
                        <div key={id} className={cm("parentGrid", { "parentGrid__active": false })}
                            onClick={() => {
                                addMember(id)
                                setEdit(true)
                            }}
                        >
                            <div className="child1 ">
                                <p className="text pointer">{name}</p>
                            </div>
                            <div className="child2">
                                <p className="text pointer">{email}</p>
                            </div>
                            <div className="child3 allignRight">
                                <p className="text pointer">{phoneNumber}</p>
                            </div>
                            <div className="child4">
                                <p className="text pointer">{role === "admin" ? "Admin" : "Member"}</p>
                            </div>
                            <div className="child5">
                                <img src={isDisable ? eye_black : eye} alt={"search"}
                                    className="iconText pointer"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        errorCtx.setWarning(`This will This action will 
                                                         ${isDisable ? "allow" : "prevent"} 
                                                         your team member 
                                                         ${isDisable ? "to" : "from"} 
                                                         logging in to the system and use it
                                                         `, () => {
                                            //disableMember(id, !isDisable)
                                        }, () => {
                                        })
                                    }} />
                            </div>
                            <div className="child6">
                                <img src={pencil_black} alt={"edit"} className="icon pointer"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        addMember(id);
                                        setEdit(true)
                                    }} />
                            </div>
                        </div>
                    )
                })
            ]
        } else {
            return <NoData />;
        }
    }
    return (
        <div className="myTeam">
            <div className="midContainer">
                <div className="projectId__header">
                    <div className="projectId__body--heading">
                        <Search
                            setSearchText={setSearchText}
                            searchText={searchText}
                            placeholder="Search users"
                        />
                    </div>
                    <div className="projectId__header--filter">
                        <button onClick={e => setEdit(true)} className="projectId__header--filter--button" >Add User</button>
                    </div>
                </div>
                <div className="midContainer__body">
                    <div key={0} className="parentGrid gridHeader">
                        <div className="child1">
                            <p className="text pointer">Name</p>
                        </div>
                        <div className="child2">
                            <p className="text pointer">Email</p>
                        </div>
                        <div className="child3 allignRight">
                            <p className="text pointer">Phone No.</p>
                        </div>
                        <div className="child4">
                            <p className="text pointer">Role</p>
                        </div>
                        <div className="child5">
                            <p className="text pointer">Status</p>
                        </div>
                        <div className="child6">
                            <p className="text pointer">Edit</p>
                        </div>
                    </div>
                    {loading ? <Loading /> : <div className="projectGrid">{renderUsers()}</div>}
                </div>
            </div>

            {
                edit &&
                <div className="rightContainer">
                    <>
                        <div className="detail">
                            <div className="dhead dheadActive">
                                <p className="dback pointer" onClick={() => { resetMember(); setEdit(false); }}><b>&#10094;&nbsp; Back</b></p>
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

            {
                !edit && <div className="rightContainerEmpty">
                    <p className="editText"> Select view or edit</p>
                    <img src={unDraw} alt={"search"} className="image" />
                </div>
            }
        </div >
    )
}

export default Users;