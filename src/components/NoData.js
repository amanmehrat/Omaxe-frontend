import React from 'react';
import { ReactComponent as NoDataDisplay } from "../img/make_it_rain_iwk4.svg"


const NoData = ({ text }) => {

    return (
        <div className="noData">
            <NoDataDisplay />
            <div className="noDataText">{text || "No data Present"}</div>
        </div>
    );
};

export default NoData;
