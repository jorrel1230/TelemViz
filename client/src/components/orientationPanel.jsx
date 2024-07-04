import { useState, useEffect } from 'react';
import OrientationModel from './subcomponents/orientationModel';
import './panel.css';

function OrientationPanel() {

    // Initial quaternion data
    const [quaternionData, setQuaternionData] = useState([-999, -999, -999, -999]);

    // Function to fetch quaternion data from the API
    const fetchQuaternionData = async () => {
        try {
            const response = await fetch('http://localhost:5000/imu/gyro/quaternion');
            const data = await response.json();
            const q = [data.x, data.y, data.z, data.w]
            setQuaternionData(q);
            
        } catch (error) {
            console.error('Error fetching quaternion data:', error);
        }
    };

    

    useEffect(() => {
        // Fetch data immediately on mount
        fetchQuaternionData();

        // Set up an interval to fetch data every 50 MILLIseconds
        const intervalId = setInterval(fetchQuaternionData);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='panel w-[300px] h-[750px]'>

            <h1>Orientation Data</h1>

            <OrientationModel quaternionData={quaternionData}/>
            <p>x: {quaternionData[0].toFixed(4)}</p>
            <p>y: {quaternionData[1].toFixed(4)}</p>
            <p>z: {quaternionData[2].toFixed(4)}</p>
            <p>w: {quaternionData[3].toFixed(4)}</p>
        
        </div>
    );
}

export default OrientationPanel;