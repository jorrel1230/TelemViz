import './panel.css'
import { useState, useEffect } from 'react';
import SingleGraph from './subcomponents/singleGraph';



function PressurePanel({ pressure, time }) {

    // Initial quaternion data
    const init_data = Array(125).fill({t: -999, value:-999})
    const [pressureData, setPressureData] = useState({t: -999, value:-999});
    const [gData, setgData] = useState(init_data);

    useEffect(() => {
        
        setPressureData({t:time, value:pressure});        
        setgData(prevData => {
            const newData = [...prevData];
            newData.shift();
            newData.push(pressureData);
            return newData
        });

    }, [pressure]);

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