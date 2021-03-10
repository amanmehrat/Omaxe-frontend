import React from 'react';
import { ReactComponent as NoDataDisplay } from "../img/make_it_rain_iwk4.svg"


const NoData = () => {

    return (
        <div className="noData">
            <NoDataDisplay />
            <div className="noDataText">No data Present</div>
        </div>
    );
};

export default NoData;
