import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";
import { Avatar, Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "mapbox-gl/dist/mapbox-gl.css";
import { useUser } from "../../users/providers/UserProvider";
import Spinner from "../../layout/components/Spinner";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { freeToken, createGeoJSONCircle } from "../../utils/mapBoxService";
import { addDiscountToUser } from "../../users/service/userApi";

const MapGame = () => {
  const [viewport, setViewport] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [points, setPoints] = useState([]);
  const [enteredCircles, setEnteredCircles] = useState([]);
  const [discountApplied, setDiscountApplied] = useState(false);

  const { user } = useUser();
  // console.log(
  //   "process.env.REACT_APP_MAPBOX_TOKEN",
  //   process.env.REACT_APP_MAPBOX_TOKEN
  // );
  const circles = points.map((point) =>
    createGeoJSONCircle([point.longitude, point.latitude], 0.415)
  );
  // 0.005 km is equal to 5 meters.

  useEffect(() => {
    const watchUser = navigator.geolocation.watchPosition((position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      setUserLocation({
        latitude: userLat,
        longitude: userLon,
      });

      // Center the map on user's location
      setViewport({
        latitude: userLat,
        longitude: userLon,
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 19,
        pitch: 75,
      });

      // Generate random points near the user's location
      if (points.length === 0) {
        const nearbyPoints = Array.from({ length: 5 }).map(() => ({
          latitude: userLat + (Math.random() - 0.5) * 0.01,
          longitude: userLon + (Math.random() - 0.5) * 0.01,
        }));
        setPoints(nearbyPoints);
      }
    });

    return () => navigator.geolocation.clearWatch(watchUser);
  }, [points]);

  const activateDiscount = async () => {
    // This function gets activated when the user enters any circle.
    console.log("User entered the circle!");
    try {
      await addDiscountToUser(user._id);
      console.log("Discount added to user's cart!");
    } catch (error) {
      console.error("Error adding discount to cart:", error);
    }
  };
  useEffect(() => {
    if (userLocation && circles.length) {
      const userPoint = point([userLocation.longitude, userLocation.latitude]);

      for (let [index, circle] of circles.entries()) {
        if (
          !enteredCircles.includes(index) &&
          booleanPointInPolygon(userPoint, circle)
        ) {
          activateDiscount();
          setEnteredCircles((prevState) => [...prevState, index]);
          break; // Break after the first match
        }
      }
    }
  }, [userLocation, circles]);

  if (!user)
    return (
      <Typography>
        {" "}
        You must be registered and logged to use the feature!
      </Typography>
    );
  if (!viewport)
    return (
      <>
        <Typography variant="h5">please consent access to location</Typography>
        <Spinner />
      </>
    );
  return (
    <ReactMapGL
      initialViewState={viewport}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapboxAccessToken={freeToken}
    >
      {" "}
      {userLocation && (
        <Marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        >
          <Box color="red">
            {/* <MyLocationIcon /> */}
            <Avatar src={user.image.url ? user.image.url : user.image.alt} />
          </Box>
        </Marker>
      )}
      {circles.map((circle, index) => {
        if (!enteredCircles.includes(index)) {
          return (
            <Source key={`circle-source-${index}`} type="geojson" data={circle}>
              <Layer
                key={`circle-layer-${index}`}
                type="fill"
                paint={{
                  "fill-color": "blue",
                  "fill-opacity": 0.6,
                }}
              />
            </Source>
          );
        }
        return null;
      })}
    </ReactMapGL>
  );
};

export default MapGame;
