import { useState, useEffect } from 'react';
import OrientationModel from './orientationPanelSubComponents/orientationModel';

function OrientationPanel() {

    // Initial quaternion data
    const [quaternionData, setQuaternionData] = useState([0, 0, 0, 1]);

    // Function to fetch quaternion data from the API
    const fetchQuaternionData = async () => {
        try {
            const response = await fetch('http://localhost:5000/gyro/rand_quaternion');
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

        // Set up an interval to fetch data every 0 MILLIseconds
        const intervalId = setInterval(fetchQuaternionData, 0);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='w-[300px] h-[720px] 
            bg-[#333333] 
            p-[20px] m-7 rounded-lg
            font-roboto text-xl font-light text-[#A0A0A0]
            border-[#E77500] border'>

            <h1>Orientation Data</h1>

            <OrientationModel quaternionData={quaternionData}/>
            <p>Pitch: {((2 * Math.atan2( 1 + 2 * (quaternionData[3] * quaternionData[1] - quaternionData[0] * quaternionData[2]),
                                        1 - 2 * (quaternionData[3] * quaternionData[1] - quaternionData[0] * quaternionData[2]))
                        - 1.570796)*57.2957795).toFixed(5)}°</p>

            <p>Yaw: {((Math.atan2( 2 * (quaternionData[3] * quaternionData[2] + quaternionData[0] * quaternionData[1]),
                                    1 - 2 * (quaternionData[1] * quaternionData[1] - quaternionData[2] * quaternionData[2])))*57.2957795).toFixed(5)}°</p>

            <p>Roll: {((Math.atan2( 2 * (quaternionData[3] * quaternionData[0] + quaternionData[1] * quaternionData[2]),
                                    1 - 2 * (quaternionData[0] * quaternionData[0] + quaternionData[1] * quaternionData[1])))*57.2957795).toFixed(5)}°</p>
        
        </div>
    );
}

export default OrientationPanel;