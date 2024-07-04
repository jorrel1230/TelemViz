import './panel.css'
import { useState, useEffect } from 'react';
import SingleGraph from './subcomponents/singleGraph';



function PressurePanel() {

    const start_time = Date.now()

    // Initial quaternion data
    const init_data = Array(125).fill({t: -999, value:-999})
    const [pressureData, setPressureData] = useState({t: -999, value:-999});
    const [gData, setgData] = useState(init_data);

    // Function to fetch quaternion data from the API
    const fetchPressureData = async () => {
        try {
            const response = await fetch('http://localhost:5000/barometer/pressure');
            const data = await response.json();
            const d = {
                value: data, 
                t: Math.round((Date.now() - start_time)/1000)
            }
            setPressureData(d);        
            setgData(prevData => {
                const newData = [...prevData];
                newData.shift();
                newData.push(d);
                return newData
            });

        } catch (error) {
            console.error('Error fetching Temperature data:', error);
        }

    };

    

    useEffect(() => {
        // Fetch data immediately on mount
        fetchPressureData();

        // Set up an interval to fetch data every 0 MILLIseconds
        const intervalId = setInterval(fetchPressureData, 67);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='panel relative'>

            <h1>Pressure Data</h1>
            <div className="text-xs p-0 m-0 absolute left-[-20px]">
                <SingleGraph data={gData} />
            </div>
            <div className="absolute bottom-2 text-sm">
                <p className="text-[#8884d8]">Pressure: {pressureData.value.toFixed(3)}</p>
            </div>
            
            

        </div>
    );
}

export default PressurePanel;