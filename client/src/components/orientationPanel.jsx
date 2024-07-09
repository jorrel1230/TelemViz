import { useState, useEffect } from 'react';
import OrientationModel from './subcomponents/orientationModel';
import './panel.css';

function OrientationPanel({ quaternion }) {

    // Initial quaternion data
    const [quaternionData, setQuaternionData] = useState([-999, -999, -999, -999]);


    useEffect(() => {
        setQuaternionData([quaternion.x, quaternion.y, quaternion.z, quaternion.w])
    }, [quaternion]);

    
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