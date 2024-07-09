import { useState, useEffect } from 'react';
import './panel.css'
import StatusIndicator from './subcomponents/statusIndicator';

function StatusPanel({ status }) {

    const [statusData, setStatusData] = useState({});

    useEffect(() => {
        setStatusData(status);
    }, [status]);

    return (
        <div className='panel w-[200px] h-[750px] '>

            <h1>Status Panel</h1>

            <div className="inline-flex m-2">
                <p>GPS: </p>
                <StatusIndicator status={statusData.gps} />
            </div>

            <div className="inline-flex m-2">
                <p>IMU: </p>
                <StatusIndicator status={statusData.imu} />
            </div>

            <div className="inline-flex m-2">
                <p>BMP: </p>
                <StatusIndicator status={statusData.barometer} />
            </div>

        </div>
    );
}

export default StatusPanel;