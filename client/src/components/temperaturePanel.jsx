import './panel.css'
import { useState, useEffect } from 'react';
import SingleGraph from './subcomponents/singleGraph';



function TemperaturePanel({ temp, time }) {

    // Initial temperature data
    const init_data = Array(125).fill({t: -999, value:-999})
    const [tempData, setTempData] = useState({t: -999, value:-999});
    const [gData, setgData] = useState(init_data);
    
    useEffect(() => {
        setTempData({t: time, value: temp});        
        setgData(prevData => {
            const newData = [...prevData];
            newData.shift();
            newData.push(tempData);
            return newData
        });
    }, [temp]);

    return (
        <div className='panel relative'>

            <h1>Temperature Data</h1>
            <div className="text-xs p-0 m-0 absolute left-[-20px]">
                <SingleGraph data={gData} />
            </div>
            <div className="absolute bottom-2 text-sm">
                <p className="text-[#8884d8]">Temperature: {tempData.value.toFixed(3)}</p>
            </div>
            
            

        </div>
    );
}

export default TemperaturePanel;