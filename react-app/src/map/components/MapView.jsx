import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Map, { Marker, useMap } from 'react-map-gl';
import { useMediaQuery, useTheme } from '@mui/material';
import debounce from 'lodash.debounce';
import '../styles/MapView.css';
import '../styles/MapEffects.css';
import '../styles/EngagingMap.css';
import {
  createMapParticle,
  createRippleEffect,
  createWaterRipple,
  getCurrentTimeOfDay,
  createAmbientParticles,
  getTimeBasedMapStyle
} from '../utils/mapEffects';

// EnhancedMapController manages map styling and effects
const EnhancedMapController = ({ map, timeOfDay }) => {
  useEffect(() => {
    if (!map) return;
    
    // Apply time-based styling
    const mapStyle = getTimeBasedMapStyle(timeOfDay);
    
    // In a real implementation, we would modify the map's style layers
    // For demonstration, we'll log the style change
    console.log(`Applied ${timeOfDay} styling to map`);
    
    // Create water ripple effects on bodies of water
    if (map.getLayer('water')) {
      map.setPaintProperty('water', 'fill-color', mapStyle.style.water);
    }
    
    // Adjust building colors
    if (map.getLayer('building')) {
      map.setPaintProperty('building', 'fill-color', mapStyle.style.buildings);
    }
    
    // Update ambient light if 3D is enabled
    if (map.getLight) {
      map.setLight({
        anchor: 'viewport',
        color: '#fff',
        intensity: mapStyle.style.ambientLight
      });
    }
    
  }, [map, timeOfDay]);
  
  return null;
};

const MapView = ({
  viewport,
  users,
  onViewStateChange,
  onLoad,
  onError,
  currentUser,
  onUserClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredUser, setHoveredUser] = useState(null);
  const [touchedUser, setTouchedUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getCurrentTimeOfDay());
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const touchTimeoutRef = useRef(null);
  const ambientParticlesRef = useRef(null);
  
  // Get the map instance from react-map-gl
  const { current: map } = useMap();
  
  // Update time of day every 15 minutes
  useEffect(() => {
    const updateTimeInterval = setInterval(() => {
      const newTimeOfDay = getCurrentTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setIsTransitioning(true);
        setTimeout(() => {
          setTimeOfDay(newTimeOfDay);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 300);
        }, 300);
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(updateTimeInterval);
  }, [timeOfDay]);
  
  // Initialize ambient particles
  useEffect(() => {
    if (containerRef.current && !ambientParticlesRef.current) {
      ambientParticlesRef.current = createAmbientParticles(
        containerRef.current,
        15,
        timeOfDay
      );
      ambientParticlesRef.current.start();
    }
    
    return () => {
      if (ambientParticlesRef.current) {
        ambientParticlesRef.current.stop();
      }
    };
  }, [containerRef.current]);
  
  // Update ambient particles when time of day changes
  useEffect(() => {
    if (ambientParticlesRef.current) {
      ambientParticlesRef.current.updateTimeOfDay(timeOfDay);
    }
  }, [timeOfDay]);
  
  // Cleanup particles when component unmounts
  useEffect(() => {
    return () => {
      particlesRef.current.forEach(particle => {
        if (particle && particle.cleanup) {
          particle.cleanup();
        }
      });
      
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);
  
  const handleMapLoad = useCallback(event => {
    setLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  }, [onLoad]);
  
  const handleMouseMove = useCallback(e => {
    // Create subtle hover particle effect every few pixels moved
    if (containerRef.current && e.target.classList.contains('mapboxgl-canvas')) {
      const now = Date.now();
      if (!containerRef.current.lastParticleTime || now - containerRef.current.lastParticleTime > 150) {
        const particle = createMapParticle(
          e.offsetX, 
          e.offsetY, 
          'hover',
          containerRef.current
        );
        particlesRef.current.push(particle);
        containerRef.current.lastParticleTime = now;
      }
    }
  }, []);
  
  const handleMapClick = useCallback(e => {
    // Create click particle effect
    if (containerRef.current) {
      const ripple = createRippleEffect(
        e.offsetX,
        e.offsetY,
        containerRef.current,
        5
      );
      particlesRef.current.push(ripple);
      
      // Create water ripple if map is available
      if (map && e.lngLat) {
        const waterRipple = createWaterRipple(map, [e.lngLat.lng, e.lngLat.lat]);
        particlesRef.current.push(waterRipple);
      }
    }
  }, [map]);
  
  // Get marker size based on zoom level and device type
  const getMarkerSize = useCallback(zoom => {
    const baseSize = isMobile ? 30 : 40;
    return Math.max(baseSize * (zoom / 12), 20);
  }, [isMobile]);
  
  // Get color based on user status
  const getStatusColor = useCallback(online => {
    // Enhanced vibrant colors
    return online 
      ? 'rgba(76, 217, 100, 0.9)' 
      : 'rgba(255, 69, 58, 0.9)';
  }, []);
  
  // User markers with memoization to avoid re-renders
  const userMarkers = useMemo(() => {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    
    return users
      .filter(user => {
        // More robust check for valid coordinates
        return user && user.coordinates && (
          // Check if coordinates are in {longitude, latitude} format
          (typeof user.coordinates.longitude === 'number' && 
           typeof user.coordinates.latitude === 'number' && 
           !isNaN(user.coordinates.longitude) && 
           !isNaN(user.coordinates.latitude)) ||
          // Check if coordinates are in array format [longitude, latitude]
          (Array.isArray(user.coordinates) && 
           user.coordinates.length >= 2 && 
           typeof user.coordinates[0] === 'number' && 
           typeof user.coordinates[1] === 'number' &&
           !isNaN(user.coordinates[0]) && 
           !isNaN(user.coordinates[1]))
        );
      })
      .map(user => {
        const isCurrentUserMarker = currentUser && user.id === currentUser.id;
        const size = getMarkerSize(viewport.zoom);
        
        // Get longitude and latitude based on the format of coordinates
        let longitude, latitude;
        if (Array.isArray(user.coordinates)) {
          [longitude, latitude] = user.coordinates;
        } else {
          longitude = user.coordinates.longitude;
          latitude = user.coordinates.latitude;
        }
        
        const cardCount = user.cards?.length || user.collectionStats?.totalCards || 0;
        const hasCardsForSale = user.cards?.some(c => c.forSale) || (user.collectionStats?.cardsForSale || 0) > 0;
        
        return (
          <Marker
            key={user.id}
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
          >
            <div
              className={`user-marker enhanced ${isCurrentUserMarker ? 'is-current-user' : ''} ${
                user.online || user.onlineStatus === 'Online' ? 'online' : ''
              } ${hoveredUser && hoveredUser.id === user.id ? 'hovered' : ''} ${
                touchedUser && touchedUser.id === user.id ? 'touched' : ''}`}
              onMouseEnter={() => setHoveredUser(user)}
              onMouseLeave={() => setHoveredUser(null)}
              onClick={() => onUserClick && onUserClick(user)}
              onTouchStart={() => {
                setTouchedUser(user);
                if (touchTimeoutRef.current) {
                  clearTimeout(touchTimeoutRef.current);
                }
                touchTimeoutRef.current = setTimeout(() => {
                  setTouchedUser(null);
                }, 3000);
              }}
              style={{
                width: `${size}px`,
                height: `${size}px`,
              }}
            >
              {/* Trade available indicator */}
              {hasCardsForSale && <div className="trade-indicator" />}
              
              {/* Card count badge */}
              {cardCount > 0 && (
                <div className="user-marker-badge">
                  🎴 {cardCount}
                </div>
              )}
              
              <div 
                className="location-indicator enhanced"
                style={{
                  width: `${size * 1.5}px`,
                  height: `${size * 1.5}px`,
                }}
              ></div>
              <img
                className="user-profile-image"
                src={user.profilePicture || user.profile_picture || user.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name?.first)}&background=random`}
                alt={user.username || `${user.name?.first} ${user.name?.last}`}
                width={size}
                height={size}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name?.first || 'User')}&background=random`;
                }}
              />
              <div
                className="status-indicator"
                style={{
                  backgroundColor: getStatusColor(user.online || user.onlineStatus === 'Online'),
                  width: `${size / 4}px`,
                  height: `${size / 4}px`,
                }}
              />
              {(hoveredUser && hoveredUser.id === user.id) || (touchedUser && touchedUser.id === user.id) ? (
                <div className="user-hover-info">
                  <div className="username">{user.username || `${user.name?.first} ${user.name?.last}`}</div>
                  <div className="status">
                    {user.online || user.onlineStatus === 'Online' ? '🟢 Online' : '⚫ Offline'}
                    {cardCount > 0 && ` • ${cardCount} cards`}
                  </div>
                  {hasCardsForSale && (
                    <div style={{ fontSize: '10px', color: '#4caf50', fontWeight: 'bold', marginTop: '2px' }}>
                      💰 Has cards for sale
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </Marker>
        );
      });
  }, [users, hoveredUser, touchedUser, viewport.zoom, currentUser, getMarkerSize, getStatusColor, onUserClick]);
  
  // Get Mapbox token from environment variables or fallback
  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || "pk.eyJ1IjoieW9udjEiLCJhIjoiY2xtN2pudzN0MDExazNjcjcyMnhlbzdocyJ9.NzyvPvbTL_hD1N84MKnITA";
  
  return (
    <div 
      className="map-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleMapClick}
    >
      <Map
        ref={mapRef}
        {...viewport}
        onMove={onViewStateChange}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onLoad={handleMapLoad}
        onError={onError}
        reuseMaps
      >
        {/* Time-based overlay */}
        <div className={`map-time-overlay ${timeOfDay}`}></div>
        
        {/* Enhanced map controller for styling */}
        <EnhancedMapController map={map} timeOfDay={timeOfDay} />
        
        {/* User markers */}
        {userMarkers}
        
        {/* Time transition fade effect */}
        <div className={`time-transition-fade ${isTransitioning ? 'visible' : ''}`}></div>
      </Map>
      {!loaded && (
        <div className="map-loading">
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default MapView;

