import React, { useState } from "react";
import { Grid, Box } from "@material-ui/core";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../Navbar/Navbar";

const icon = L.icon({
  iconUrl: "https://i.ibb.co/DWf0zyW/marker.png",
  iconSize: [60, 60],
});

const center = { lat: 18.566949162868177, lng: 73.77191448465354 };

const Home = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const decodePolyline = (coordinates) => {
    const polyline = coordinates.map((coordinate) => [
      coordinate[1],
      coordinate[0],
    ]);
    return polyline;
  };

  return (
    <Box>
      <Grid
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          height: "100%",
          width: "100%",
        }}
      >
        <MapContainer
          center={center}
          zoom={17}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <Navbar
            directionsResponse={directionsResponse}
            setDirectionsResponse={setDirectionsResponse}
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={process.env.REACT_APP_OSM_API_KEY}
          />
          <Marker position={center} icon={icon}>
            <Popup>You are here</Popup>
          </Marker>
          {directionsResponse && (
            <Polyline
              positions={decodePolyline(directionsResponse.coordinates)}
              color="blue"
            />
          )}
        </MapContainer>
      </Grid>
    </Box>
  );
};

export default Home;
