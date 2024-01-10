import { useState, useEffect } from 'react';
import './App.css'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import { GeoJSON } from 'react-leaflet/GeoJSON'
import coTrackLineData from './data/CO/tracks.json'
import coWaypointsData from './data/CO/waypoints.json'

const selectMapFeature = (feature: { properties: { name: any; }; }, layer: { bindPopup: (arg0: any) => void; on: (arg0: any) => void;}) => {
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
  
  interface UserLocationState {
    loaded: boolean,
    coordinates: {lat: number|null, lng: number|null},
    accuracy: number|null,
    heading: number|null,
    speed: number|null
  }
  
  const [location, setLocation] = useState<UserLocationState>({
    loaded: false,
    coordinates: {lat: null, lng: null},
    accuracy: null,
    heading: null,
    speed: null
  })
  
  const on_success = (pos: { coords: { latitude: number|null; longitude: number|null; accuracy: number|null; heading: number|null; speed: number|null }; }) => {
    setLocation({
      loaded: true,
      coordinates: {lat: pos.coords.latitude, lng: pos.coords.longitude},
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed
    })
  }
  
  const on_error = (err: { code: number; }) => {
    if (err.code == 1){
      alert('Please allow geolocation access.')
    } else {
      alert('There was a problem getting current location.')
    }
  }
  
  useEffect(() => {
    let id = navigator.geolocation.watchPosition(on_success, on_error);
    console.log(`geolocation handler id: ${id}`);
  }, [location])
  
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
      {location.loaded && <Marker position={location.coordinates}>
        <Popup>
          You are here.
        </Popup>
      </Marker>}
      {location.loaded && 
        <CircleMarker center={location.coordinates} radius={location.accuracy}/>
      }
      <GeoJSON data={coTrackLineData.features} onEachFeature={selectMapFeature}/>
      <GeoJSON data={coWaypointsData.features} onEachFeature={selectMapFeature}/>
    </MapContainer>
  ) 
}

export default App
