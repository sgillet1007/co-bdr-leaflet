import { useState } from 'react';
import './App.css'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import { GeoJSON } from 'react-leaflet/GeoJSON'
import coTrackLineData from './data/CO/tracks.json'
import coWaypointsData from './data/CO/waypoints.json'

const showPopUp = (feature: { properties: { name: any; }; }, layer: { bindPopup: (arg0: any) => void; on: (arg0: any) => void;}) => {
  layer.bindPopup(feature.properties.name);

  layer.on({
    click: (event: { target: { setStyle: (arg0: { color: string; }) => void; }; }) => {
      event.target.setStyle({
        color: 'indigo'
      })
    }
  })
}

function App() {
  const [userLocation, setUserLocation] = useState([0,0])
  const [locationAccuracy, setLocationAccuracy] = useState(0)
  const [userLocationFound, setUserLocationFound] = useState(false)
  
  const geoloc_success = (pos: { coords: { latitude: any; longitude: any; accuracy: any; }; }) => {
    setUserLocation([pos.coords.latitude, pos.coords.longitude])
    setLocationAccuracy(pos.coords.accuracy);
    setUserLocationFound(true)
  }
  
  const geoloc_error = (err: { code: number; }) => {
    if (err.code == 1){
      alert('Please allow geolocation access.')
    } else {
      alert('There was a problem getting current location.')
    }
  }
  
  navigator.geolocation.watchPosition(geoloc_success, geoloc_error);

  return (
    <MapContainer
      center={[39.7392, -104.9903]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocationFound && <Marker position={userLocation}>
        <Popup>
          You are here.
        </Popup>
      </Marker>}
      {userLocationFound && 
        <CircleMarker center={userLocation} radius={locationAccuracy}/>
      }

      <GeoJSON data={coTrackLineData.features} onEachFeature={showPopUp}/>
      <GeoJSON data={coWaypointsData.features} onEachFeature={showPopUp}/>
    </MapContainer>
  ) 
}

export default App
