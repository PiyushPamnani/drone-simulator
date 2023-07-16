import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import { NearMeOutlined, ClearOutlined } from "@material-ui/icons";
import axios from "axios";
import L from "leaflet";
import useStyles from "./navbarStyles";
import flytbase from "../../assets/flytbase.png";
import { useMap } from "react-leaflet";

const center = { lat: 18.566949162868177, lng: 73.77191448465354 };

const Navbar = ({ directionsResponse, setDirectionsResponse }) => {
  const classes = useStyles();
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const map = useMap();

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  const handleLogoClick = () => {
    const zoomLevel = 17;
    map.setView(center, zoomLevel, { animate: true });
  };

  const calculateRoute = async () => {
    if (
      originRef.current?.value === "" ||
      destinationRef.current?.value === ""
    ) {
      return;
    }

    const origin = await geocodeLocation(originRef.current.value);
    const destination = await geocodeLocation(destinationRef.current.value);

    if (!origin || !destination) {
      console.log("Error geocoding location");
      return;
    }

    const bounds = L.latLngBounds(origin, destination);
    map.fitBounds(bounds, { animate: true, padding: [50, 50] });

    const apiKey = process.env.REACT_APP_ORS_API_KEY;
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data && data.features && data.features.length > 0) {
        const route = data.features[0];
        const distance = route.properties.summary.distance;
        const duration = route.properties.summary.duration;
        const geometry = route.geometry;

        setDirectionsResponse(geometry);
        setDistance(distance);
        setDuration(duration);
      } else {
        console.log("No route found");
      }
    } catch (error) {
      console.log("Error calculating route:", error);
    }
  };

  const geocodeLocation = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);
        return { lat: latitude, lng: longitude };
      }
    } catch (error) {
      console.log("Error geocoding location:", error);
    }
    return null;
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  return (
    <AppBar className={classes.appBar} position="fixed" color="inherit">
      <Button onClick={handleLogoClick}>
        <img src={flytbase} alt="flytbase_logo" height="45px" />
      </Button>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.box}>
          <TextField
            className={classes.margins}
            variant="outlined"
            title="Location"
            placeholder="Start location"
            inputRef={originRef}
          />
          <TextField
            className={classes.margins}
            variant="outlined"
            title="Location"
            placeholder="Destination location"
            inputRef={destinationRef}
          />
        </Box>
        <Button
          className={classes.margins}
          onClick={calculateRoute}
          type="submit"
        >
          <NearMeOutlined />
        </Button>
        <Button className={classes.margins} onClick={clearRoute}>
          <ClearOutlined />
        </Button>
        {distance !== "" && duration !== "" && (
          <div>
            <Typography>
              Distance: {(distance / 1000).toFixed(2)} kms
            </Typography>
            <Typography>
              Duration: {(duration / 3600).toFixed(2)} hrs
            </Typography>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
