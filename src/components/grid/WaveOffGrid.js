import React from 'react'
import WaveOffModels from './colmodels/WaveOffModels';
import Table from './table/Table';

const WaveOffGrid = ({ waveOffs }) => {
    let models = WaveOffModels;
    waveOffs = waveOffs.map(item => { switch (item.billType) { case 1: item.billType = "Cam"; break; case 2: item.billType = "Electricity"; break; } return item; })
    waveOffs = waveOffs.map(item => { item.createdAt = new Date(item.createdAt).toISOString().split('T')[0]; return item; })

    const columns = React.useMemo(() => [...models()], []);
    const data = React.useMemo(() => waveOffs, [waveOffs]);

    const renderBillTypeText = () => "WaveOff Bills";
    return (
        <>
            <div className="billsHeading">
                <div className="billsSubHeading">
                    {renderBillTypeText()}
                </div>
            </div>
            <Table
                columns={columns}
                data={data}
            />
        </>
    )
}

export default WaveOffGrid;
