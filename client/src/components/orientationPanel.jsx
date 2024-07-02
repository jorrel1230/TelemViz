import { useState, useEffect } from 'react';
import OrientationModel from './orientationModel';

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

        // Set up an interval to fetch data every 5 seconds
        const intervalId = setInterval(fetchQuaternionData, 50);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='w-[300px] h-[720px] 
            bg-gradient-to-br from-zinc-700 to-zinc-700 
            p-[20px] m-7 rounded-lg'>

                <OrientationModel quaternionData={quaternionData}/>
                <div className="font-roboto text-xl font-semibold text-[#D3D3D3] p-3">
                    <p>Pitch: {((2 * Math.atan2( 1 + 2 * (quaternionData[3] * quaternionData[1] - quaternionData[0] * quaternionData[2]),
                                               1 - 2 * (quaternionData[3] * quaternionData[1] - quaternionData[0] * quaternionData[2]))
                                - 1.570796)*57.2957795).toFixed(5)}</p>

                    <p>Yaw: {((Math.atan2( 2 * (quaternionData[3] * quaternionData[2] + quaternionData[0] * quaternionData[1]),
                                         1 - 2 * (quaternionData[1] * quaternionData[1] - quaternionData[2] * quaternionData[2])))*57.2957795).toFixed(5)}</p>

                    <p>Roll: {((Math.atan2( 2 * (quaternionData[3] * quaternionData[0] + quaternionData[1] * quaternionData[2]),
                                          1 - 2 * (quaternionData[0] * quaternionData[0] + quaternionData[1] * quaternionData[1])))*57.2957795).toFixed(5)}</p>
                </div>
                
        </div>
    );
}

export default OrientationPanel;