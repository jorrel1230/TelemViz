import { lazy, useEffect, useState } from 'react';

// Component Imports
const OrientationPanel = lazy(() => import('./components/orientationPanel'));
const AccelerationPanel = lazy(() => import('./components/accelerationPanel'));
const MagnetometerPanel = lazy(() => import('./components/magnetometerPanel'));
const GPSPanel = lazy(() => import('./components/gpsPanel'));
import PressurePanel from './components/pressurePanel';
import StatusPanel from './components/statusPanel';
import TemperaturePanel from './components/temperaturePanel';
import AltitudePanel from './components/altitudePanel';

// Panel CSS File
import './components/panel.css';
 
function App() {

  const start_time = Date.now()
  const [data, setData] = new useState(null);

  // Initialize Web Socket for Python-React Communication
  const connectSocket = () => {
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    ws.onmessage = (event) => {
      let d = JSON.parse(event.data);
      d.t = Math.round((Date.now() - start_time)/1000);
      setData(d);
    };
  
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(connectSocket, 1000);
    };
  
    ws.onerror = (error) => {
      console.log('WebSocket error:', error);
    };
  };

  
  useEffect(() => {
    connectSocket();
  }, [])
  

  if (data) {
    return (
      <div className="w-full h-full fixed bg-gradient-to-br from-[#121212] to-[#333333] m-0">

        <div className="w-[450px] h-auto grid grid-cols-2 float-left">
          <StatusPanel status={data.status}/>
          <OrientationPanel quaternion={data.imu.gyro.quaternion}/>
        </div>

        <div className="w-[900px] h-auto grid grid-cols-3 ml-[550px]">
          <AccelerationPanel accel={data.imu.accelerometer} time={data.t}/>
          <AltitudePanel gpsAlt={data.gps.altitude} barAlt={data.barometer.altitude} time={data.t}/>
          <TemperaturePanel temp={data.temperature} time={data.t}/>
          <GPSPanel gps={data.gps}/>
          <PressurePanel pressure={data.barometer.pressure} time={data.t}/>
          <MagnetometerPanel mag={data.imu.magnetometer} time={data.t}/>
        </div>
  
      </div>
    )
  } else {
    return (
      <div className="panel">
        <p>Waiting for Server...</p>
      </div>
    )
  }
}

export default App
