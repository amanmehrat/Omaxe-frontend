import React from "react";
import {BoxLoading} from "react-loadingg"

const Loading=()=>{
    return(
        <div style={{
            height:"100%",
            width:"100%",
            position:"relative"
        }}>
            <BoxLoading/>
        </div>
    );
};
export default Loading;