import { useState, useEffect } from 'react';
import OrientationModel from './orientationModel';
import axios from 'axios'

function OrientationPanel() {

    // Initial quaternion data
    const [quaternionData, setQuaternionData] = useState([0, 0, 0, 1]);
    console.log(quaternionData);

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
        const intervalId = setInterval(fetchQuaternionData, 0.1);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='w-[300px] h-[720px] 
            bg-gradient-to-br from-zinc-700 to-zinc-700 
            p-[20px] m-7 rounded-lg'>

                <OrientationModel quaternionData={quaternionData}/>
                <div className="font-roboto text-xl">
                    <p>X Rotation: {quaternionData.x || 0}</p>
                    <p>Y Rotation: {quaternionData.y || 0}</p>
                    <p>Z Rotation: {quaternionData.z || 0}</p>
                    <p>W Rotation: {quaternionData.w || 0}</p>
                    <button onClick={fetchQuaternionData}>Update Quaternion Data</button>
                </div>
                
        </div>
    );
}

export default OrientationPanel;