/**
 * Location Service
 * Handles geolocation functionality and location-based restrictions
 */

/**
 * Get the best available location using different methods
 * @returns {Promise<Object>} Location object with coords
 */
export const getBestAvailableLocation = async () => {
  try {
    // Try to get precise location from browser geolocation API
    const preciseLocation = await getCurrentPosition();
    return preciseLocation;
  } catch (error) {
    console.warn('Precise geolocation failed, trying IP-based location:', error);
    
    try {
      // Fallback to IP-based geolocation
      const ipLocation = await getLocationByIP();
      return ipLocation;
    } catch (ipError) {
      console.error('IP geolocation failed:', ipError);
      
      // Return default location (Tel Aviv, Israel)
      return {
        coords: {
          latitude: 32.0853,
          longitude: 34.7818,
          accuracy: 5000
        },
        timestamp: Date.now(),
        source: 'default',
        country: 'Israel'
      };
    }
  }
};

/**
 * Get current position using browser's geolocation API
 * @returns {Promise<Object>} Location object
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: position.coords,
          timestamp: position.timestamp,
          source: 'browser'
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Watch user's position for real-time updates
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 * @returns {number} Watch ID to clear the watch later
 */
export const watchUserLocation = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    onError(new Error('Geolocation is not supported by this browser'));
    return null;
  }
  
  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        coords: position.coords,
        timestamp: position.timestamp,
        source: 'browser'
      });
    },
    (error) => {
      onError(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    }
  );
};

/**
 * Get location based on IP address using a geolocation API
 * @returns {Promise<Object>} Location object
 */
export const getLocationByIP = async () => {
  try {
    // Using ipapi.co for IP-based geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'IP geolocation failed');
    }
    
    return {
      coords: {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 10000 // IP geolocation is less accurate
      },
      timestamp: Date.now(),
      source: 'ip',
      country: data.country_name,
      countryCode: data.country_code,
      city: data.city,
      region: data.region
    };
  } catch (error) {
    console.error('IP geolocation API error:', error);
    throw error;
  }
};

/**
 * Calculate distance between two points in meters
 * @param {Object} point1 - First point with lat/lng
 * @param {Object} point2 - Second point with lat/lng
 * @returns {number} Distance in meters
 */
export const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = point1.latitude * Math.PI / 180;
  const φ2 = point2.latitude * Math.PI / 180;
  const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
  const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
};

/**
 * Check if the user's location is in Israel
 * @returns {Promise<boolean>} True if user is in Israel
 */
export const isUserInIsrael = async () => {
  try {
    // Try IP-based location first as it's more reliable for country detection
    const ipLocation = await getLocationByIP();
    if (ipLocation && ipLocation.countryCode) {
      return ipLocation.countryCode === 'IL';
    }
    
    // Fallback to coordinates-based check
    const location = await getBestAvailableLocation();
    
    // Define Israel's bounding box (approximate)
    const israelBounds = {
      north: 33.3,  // Northern border
      south: 29.5,  // Southern border
      west: 34.2,   // Western border
      east: 35.9    // Eastern border
    };
    
    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    
    return lat >= israelBounds.south && 
           lat <= israelBounds.north && 
           lng >= israelBounds.west && 
           lng <= israelBounds.east;
  } catch (error) {
    console.error('Error checking if user is in Israel:', error);
    return false;
  }
};

/**
 * Check if access is allowed based on location restrictions
 * @returns {Promise<boolean>} True if access is allowed
 */
export const isAccessAllowed = async () => {
  // For development, you can bypass this check with a local flag
  if (process.env.NODE_ENV === 'development' && localStorage.getItem('bypassLocationCheck') === 'true') {
    return true;
  }
  
  return await isUserInIsrael();
};

/**
 * Format distance in meters to a human-readable string
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else if (meters < 10000) {
    return `${(meters / 1000).toFixed(1)}km`;
  } else {
    return `${Math.round(meters / 1000)}km`;
  }
};

/**
 * Generate a random point near a given location
 * @param {Object} center - Center point with coords
 * @param {number} radiusInMeters - Radius in meters
 * @returns {Array} [longitude, latitude]
 */
export const getRandomPointNear = (center, radiusInMeters = 5000) => {
  // Earth's radius in meters
  const earthRadius = 6371000;
  
  // Convert radius from meters to degrees
  const radiusInDegrees = radiusInMeters / earthRadius * (180 / Math.PI);
  
  // Get coordinates from center
  let lat, lng;
  
  if (center.coords) {
    // If center is a geolocation position
    lat = center.coords.latitude;
    lng = center.coords.longitude;
  } else if (Array.isArray(center.coordinates)) {
    // If center is a GeoJSON-like object with coordinates array [lng, lat]
    lng = center.coordinates[0];
    lat = center.coordinates[1];
  } else if (center.lat !== undefined && center.lng !== undefined) {
    // If center has lat/lng properties
    lat = center.lat;
    lng = center.lng;
  } else if (center.latitude !== undefined && center.longitude !== undefined) {
    // If center has latitude/longitude properties
    lat = center.latitude;
    lng = center.longitude;
  } else {
    // Default to Tel Aviv
    lat = 32.0853;
    lng = 34.7818;
  }
  
  // Generate random angle in radians
  const angle = Math.random() * 2 * Math.PI;
  
  // Generate random radius (not uniform, but that's fine for this purpose)
  const randomRadius = Math.random() * radiusInDegrees;
  
  // Calculate offsets
  const latOffset = randomRadius * Math.sin(angle);
  const lngOffset = randomRadius * Math.cos(angle) / Math.cos(lat * Math.PI / 180);
  
  // Calculate new coordinates
  const newLat = lat + latOffset;
  const newLng = lng + lngOffset;
  
  return [newLng, newLat];
};

// Create a named variable for the export
const LocationService = {
  getBestAvailableLocation,
  getCurrentPosition,
  watchUserLocation,
  getLocationByIP,
  calculateDistance,
  isUserInIsrael,
  isAccessAllowed,
  formatDistance,
  getRandomPointNear
};

export default LocationService;

