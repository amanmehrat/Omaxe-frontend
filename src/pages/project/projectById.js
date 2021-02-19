import useReactRouter from 'use-react-router';
import React , {useState, useEffect} from 'react';
import cm from "classnames";

import { usePost } from "../../utils/hooks";
import NoData from "../../components/NoData";
import Loading from "../../components/Loading";
import search from "../../img/search.svg";
import "./project.scss";

const ProjectById = () =>{
    const { history, match: { path: matchPath, url: matchUrl, params: { projectId } } } = useReactRouter();
    
    const [flats, setFlats] = useState(null)
    const [oldFlats, setOldFlats] = useState(null)
    const [projectName, setProjectName]= useState('');
    const [totalNoOfFlat, setTotalNoOfFlat] = useState('');
    const [loadGetData , setLoadGetData] = useState(true);
    const [loading,setLoading] = useState(true)

    const {run : getFlatsList } = usePost("/flats", { projectId }, 
    {
        onResolve: (data) =>{
            setFlats(data.flats);
            setOldFlats(data.flats);
            if(data && data.flats && data.flats[0] && data.flats[0].project)
                setProjectName(data.flats[0].project.name);
                setTotalNoOfFlat(data.flats.length);
            setLoading(false);
        },
        onReject: (error)=>{
            console.log("error ------" , error);
        }
    });

    useEffect(() => {
        setLoadGetData(false);
        getFlatsList();
    }, [loadGetData]);

    const searchText = (e) =>{
        e.preventDefault();
        const searchValue = e.target.value;
        let newFlats = oldFlats.filter(obj =>{
            return obj.residentName.toUpperCase().includes(searchValue.toUpperCase())
              || obj.ownerName.toUpperCase().includes(searchValue.toUpperCase())
              || obj.flatNumber.toUpperCase().includes(searchValue.toUpperCase())
              || obj.blockIncharge.toUpperCase().includes(searchValue.toUpperCase())
              || obj.meterNumber.toUpperCase().includes(searchValue.toUpperCase())
              ;
        });
        setFlats(newFlats);
    }

    const showDetails = (e , id) =>{
        e.preventDefault();
        history.push("/flat/" + id);
    }
    return(
        <div className="myprojects">
            <div className="midContainer">
            <div className="midContainer__head">

                    <div className="midContainer__head--field">
                        <img
                            src={search}
                            alt="search"
                            className="midContainer__head--field--search"
                        />
                        <input
                            onChange={(e) => searchText(e)}
                            type="text"
                            placeholder="search"
                            className="midContainer__head--field--input"
                        />
                    </div>
                    <div className="midContainer__head--filter">
                    <button className="midContainer__head--filter--button">Add Flat</button>
                    <button className="midContainer__head--filter--button">Upload Excel</button>
                    <button className="midContainer__head--filter--button">Import Excel</button>
                    <button className="midContainer__head--filter--button">Generate Bill</button>
                    </div>                        
                </div>

                
                <div className="midContainer__body">
                {projectName ? 
                <div className="divrightleft">
                    <div className="divchild">
                    <h1><b>Project Name :</b> {projectName}</h1>
                    </div>
                    <div className="divchile">
                    <h3><b>Total No of Flats:</b> {totalNoOfFlat}</h3>
                    <h3><b>Number of Occupied Flats:</b> {totalNoOfFlat -10}</h3>
                    <h3><b>Number of vacant Flats:</b> 10</h3><br/>
                    </div>
                    </div> 
                : ''}
                
                    {
                        loading ? <Loading /> :  (flats && Object.keys(flats).length?
                        (
                        
                            Object.keys(flats).map((key) => {
                            let { id, residentName, ownerName, propertyType, flatNumber, blockNumber } = flats[key]
                            return(
                                <div className={cm("contentMid", {"contentMid__active": false})}
                                    onClick={(e) => {
                                        showDetails(e, id);
                                    }}
                                    >
                                        <div className="text1 ">
                                            <p className="text pointer">{residentName}</p>
                                        </div>
                                        <div className="text2">
                                            <p className="text pointer">{ownerName}</p>
                                        </div>
                                        <div className="text3">
                                            <p className="text pointer">{propertyType===0 ?"3BHK" : "2BHK"}</p>
                                        </div>
                                        <div className="text4">
                                            <p className="text pointer">{flatNumber}</p>
                                        </div>
                                        <div className="text5">
                                            <p className="text pointer">{blockNumber}</p>
                                        </div>
                                </div>
                            )
                            
                            })
                        )
                    : <NoData/>) 
                    }
                </div>
            </div>

        </div>
    )
}

export default ProjectById;