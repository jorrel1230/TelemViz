import { useState, useEffect } from 'react';
import './panel.css'
import StatusIndicator from './subcomponents/statusIndicator';

function StatusPanel() {

    const [statusData, setStatusData] = useState({});

    const fetchStatusData = async () => {
        try {
            const response = await fetch('http://localhost:5000/status');
            const data = await response.json();
            setStatusData(data);
            
        } catch (error) {
            console.error('Error fetching quaternion data:', error);
        }
    }

    useEffect(() => {
        // Fetch data immediately on mount
        fetchStatusData();

        // Set up an interval to fetch data every second
        const intervalId = setInterval(fetchStatusData, 67);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

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