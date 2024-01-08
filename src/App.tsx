import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  
  const position = [39.7392, -104.9903];

  return (
    <MapContainer
      center={position}
      zoom={7}
      scrollWheelZoom={true}
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={coTrackLineData.features} onEachFeature={showPopUp}/>
      <GeoJSON data={coWaypointsData.features} onEachFeature={showPopUp}/>
    </MapContainer>
  ) 
}

export default App
