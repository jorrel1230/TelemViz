import { useState, useEffect } from "react";
import './panel.css';
import QuadGraph from "./subcomponents/quadGraph";


function AccelerationPanel({ accel, time }) {

    // Initial acceleration data
    const init_data = Array(125).fill({t: -999, x:-999, y:-999, z:-999, net:-999})
    const [accData, setAccData] = useState({t: -999, x:-999, y:-999, z:-999, net:-999});
    const [gData, setgData] = useState(init_data);

    useEffect(() => {
        accel.t = time
        setAccData(accel)
        setgData(prevData => {
            const newData = [...prevData];
            newData.shift();
            newData.push(accel);
            return newData
        });
    }, [accel]);

    return (
        <div className='panel relative'>

            <h1>Acceleration Data</h1>
            <div className="text-xs p-0 m-0 absolute left-[-20px]">
                <QuadGraph data={gData} />
            </div>
            <div className="absolute bottom-7 text-sm w-[250px] grid grid-cols-3">
                <p className="text-[#8884d8]">x: {accData.x.toFixed(3)}</p>
                <p className="text-[#ff13ff]">y: {accData.y.toFixed(3)}</p>
                <p className="text-[#0e7aff]">z: {accData.z.toFixed(3)}</p>
            </div>
            <div className="absolute bottom-2 text-sm">
                <p className="text-[#ffffff]">net: {accData.net.toFixed(4)}</p>
            </div>
            
            

        </div>
    );
}

export default AccelerationPanel;