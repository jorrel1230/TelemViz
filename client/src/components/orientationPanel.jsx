import { useState, useEffect } from 'react';
import OrientationModel from './orientationModel';
import axios from 'axios'

function OrientationPanel() {

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            axios.get('http://localhost:5000/data')
                .then((response) => {
                    console.log(response.data.rotation)
                    setData(response.data)
                })
                .catch((err) => console.log(err))
        };

        fetchData();

        const intervalId = setInterval(fetchData, 0.01); 

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, []);


    if (data) {
        return (
        <div className='w-[300px] h-[720px] 
            bg-gradient-to-br from-zinc-700 to-zinc-700 
            p-[20px] m-7 rounded-lg'>

                <OrientationModel rot={[data.rotation.x || 0, 
                                        data.rotation.y || 0, 
                                        data.rotation.z || 0]}/>
                <div className="font-roboto text-xl">
                    <p>X Rotation: {data.rotation.x || 0}</p>
                    <p>Y Rotation: {data.rotation.y || 0}</p>
                    <p>Z Rotation: {data.rotation.z || 0}</p>
                </div>

                
                
        </div>
        );
    }
}

export default OrientationPanel;


