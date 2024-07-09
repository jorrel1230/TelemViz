import { useState, useEffect } from "react";
import './panel.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';


function AltitudePanel({ gpsAlt, barAlt, time}) {

    // Initial altitude data
    const init_data = Array(125).fill({t: -999, gps:-999, barometer:-999})
    const [altData, setAltData] = useState({t: -999, gps:-999, barometer:-999});
    const [gData, setgData] = useState(init_data);
    

    useEffect(() => {
        setAltData({t: time, gps:gpsAlt, barometer:barAlt});        
        setgData(prevData => {
            const newData = [...prevData];
            newData.shift();
            newData.push(altData);
            return newData
        });

    }, [gpsAlt, barAlt]);

    return (
        <div className='panel relative'>

            <h1>Altitude Data</h1>
            <div className="text-xs p-0 m-0 absolute left-[-20px]">
                <LineChart width={290} height={250} data={gData}>
                    <Line type="monotone" dataKey="gps" stroke="#8884d8" />
                    <Line type="monotone" dataKey="barometer" stroke="#ff13ff" />
                    

                    <XAxis dataKey="t" interval={50}/>
                    <YAxis domain={['auto', 'auto']}/>
                </LineChart>
            </div>
            <div className="absolute bottom-7 text-sm">
                <p className="text-[#8884d8]">GPS Altitude: {altData.gps.toFixed(3)}</p>
            </div>
            <div className="absolute bottom-2 text-sm">
                <p className="text-[#ff13ff]">Barometer Alt: {altData.barometer.toFixed(3)}</p>
            </div>
            
            

        </div>
    );
}

export default AltitudePanel;