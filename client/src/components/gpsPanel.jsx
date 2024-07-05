import './panel.css'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function GPSPanel() {

    const [locationData, setLocationData] = useState({latitude:0, longitude:0, altitude:0});

    const fetchGpsData = async () => {
        try {
            const response = await fetch('http://localhost:5000/gps');
            const data = await response.json();
            setLocationData(data);     
        } catch (error) {
            console.error('Error fetching GPS data:', error);
        }
    }

    useEffect(() => {
        // Fetch data immediately on mount
        fetchGpsData();

        // Set up an interval to fetch data every 0 MILLIseconds
        const intervalId = setInterval(fetchGpsData, 67);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    function ChangeView({ center }) {
        const map = useMap();
        map.setView(center);
        return null;
    }


    return (
        <div className='panel relative'>

            <h1>GPS Data</h1>

            <MapContainer center={[locationData.latitude, locationData.longitude]} zoom={13} style={{ height: '75%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={[locationData.latitude, locationData.longitude]}/>
                {[locationData].map((location) => (
                    <Marker key={location.id} position={[location.latitude, location.longitude]}>
                        <Popup>{location.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div className="absolute bottom-2 text-sm w-[250px] text-white">
                <p>LAT: {locationData.latitude.toFixed(7)}</p>
                <p>LNG: {locationData.longitude.toFixed(7)}</p>
                <p>ALT: {locationData.altitude.toFixed(7)}</p>
            </div>
            

        </div>
    );
}

export default GPSPanel;