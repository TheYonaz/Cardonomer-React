export const freeToken =
  "pk.eyJ1IjoieW9udjEiLCJhIjoiY2xtN2pudzN0MDExazNjcjcyMnhlbzdocyJ9.NzyvPvbTL_hD1N84MKnITA";

export const createGeoJSONCircle = (center, radiusInKm, points = 64) => {
  const coords = {
    latitude: center[1],
    longitude: center[0],
  };

  const km = radiusInKm;
  const ret = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [ret],
    },
  };
};
