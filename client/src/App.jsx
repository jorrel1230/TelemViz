import OrientationPanel from './components/orientationPanel';
import AccelerationPanel from './components/accelerationPanel';
import PressurePanel from './components/pressurePanel';
import StatusPanel from './components/statusPanel';
import TemperaturePanel from './components/temperaturePanel';
import GPSPanel from './components/gpsPanel';
import AltitudePanel from './components/altitudePanel';

function App() {
  return (
    <div className="w-full h-full fixed bg-gradient-to-br from-[#121212] to-[#333333] m-0">
      <div className="w-[450px] h-auto grid grid-cols-2 float-left">
        <StatusPanel />
        <OrientationPanel />
      </div>

      <div className="w-[900px] h-auto grid grid-cols-3 ml-[550px]">
        <AccelerationPanel />
        <AltitudePanel />
        <TemperaturePanel />
        <GPSPanel />
        <PressurePanel />
      </div>
      
      

      
    </div>
  )
}

export default App
