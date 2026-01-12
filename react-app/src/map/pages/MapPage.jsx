import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Fab, Drawer, useMediaQuery, useTheme, IconButton, Typography, CircularProgress, Paper, SwipeableDrawer, Snackbar, Alert, Tooltip, Zoom } from '@mui/material';
import '../styles/EngagingMap.css';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PersonIcon from '@mui/icons-material/Person';
import { DEFAULT_MOCK_USERS } from '../constants/data';
import MapView from '../components/MapView';
import UserSidebar from '../components/UserSidebar';
import { getBestAvailableLocation, watchUserLocation } from '../services/LocationService';
import { generateMockUsers } from '../services/MockDataGenerator';

const MapPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Mock user data for local development - using useMemo to prevent re-renders
  const user = useMemo(() => ({
    id: 'local-user-123',
    name: 'Local User',
    email: 'user@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Local+User&background=random'
  }), []);
  const mapRef = useRef();
  const mapContainerRef = useRef(null);
  const locationWatchIdRef = useRef(null);

  // State for the sidebar and error handling
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]); // Start with empty array
  const [locationAlert, setLocationAlert] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false);
  const [locationControlTimer, setLocationControlTimer] = useState(null);
  
  // Handle map loading and errors
  const handleMapLoad = () => {
    setMapLoading(false);
    setMapError(null);
  };
  
  const handleMapError = (error) => {
    console.error('Map error:', error);
    setMapError(error.message || 'Failed to load map');
    setMapLoading(false);
  };
  
  // Retry loading the map if there was an error
  const handleRetryMap = () => {
    setMapError(null);
    setMapLoading(true);
    loadLocationAndUsers();
  };


  // State for the map viewport
  const [viewport, setViewport] = useState({
    longitude: -73.97,
    latitude: 40.77,
    zoom: 12,
    bearing: 0,
    pitch: 0
  });

  // Load user location and initialize map data
  const loadLocationAndUsers = async () => {
    setLocationLoading(true);
    setLocationError(null);
    
    try {
      // Get the best available location (geolocation, IP, or default)
      const location = await getBestAvailableLocation();
      setUserLocation(location);
      
      try {
        // Generate mock users based on the location
        const mockUsers = await generateMockUsers(location, { count: 10, radius: 5000 });
        
        // Validate that mockUsers is an array before setting state
        if (Array.isArray(mockUsers) && mockUsers.length > 0) {
          setAllUsers(mockUsers);
        } else {
          console.warn('Generated mock users is not a valid array, using fallback data');
          setAllUsers(DEFAULT_MOCK_USERS);
        }
      } catch (userError) {
        console.error('Error generating mock users:', userError);
        // Fall back to default mock users
        setAllUsers(DEFAULT_MOCK_USERS);
      }
      
      // Update viewport to center on user location
      if (location && location.coords) {
        setViewport({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          zoom: 14,
          bearing: 0,
          pitch: 0
        });
      }
      
      setLocationLoading(false);
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocationError(error.message || 'Failed to get your location');
      setLocationLoading(false);
      
      // Use default mock users as fallback
      setAllUsers(DEFAULT_MOCK_USERS);
      
      // Default viewport (Tel Aviv)
      setViewport({
        longitude: 34.7818,
        latitude: 32.0853,
        zoom: 12,
        bearing: 0,
        pitch: 0
      });
    }
  };

  // Function to handle opening the sidebar
  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  // Function to handle closing the sidebar
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Handle user click on the map
  const handleUserClick = (clickedUser) => {
    setSelectedUser(clickedUser);
    setSidebarOpen(true);
  };

  // Open the current user's profile
  const handleOpenUserProfile = () => {
    // Find the current user's entry in the allUsers array
    const currentUserEntry = allUsers.find(u => u.id === user.id);
    if (currentUserEntry) {
      setSelectedUser(currentUserEntry);
      setSidebarOpen(true);
    } else if (user) {
      // If we can't find the user in allUsers but we have user data
      // Create a temporary user object
      const tempUserEntry = {
        id: user.id,
        username: user.name || 'You',
        profilePicture: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'You')}&background=primary`,
        coordinates: userLocation ? [userLocation.coords.longitude, userLocation.coords.latitude] : [0, 0],
        locationPrecision: 'Exact',
        onlineStatus: 'Online',
        lastActive: new Date().toISOString(),
        bio: 'This is you!',
        collectionStats: {
          totalCards: user.cards || 0,
          cardsForSale: 0,
          completedTrades: user.trades || 0
        }
      };
      setSelectedUser(tempUserEntry);
      setSidebarOpen(true);
    }
  };

  // Jump to user's location
  const handleJumpToUserLocation = () => {
    if (userLocation) {
      setViewport({
        ...viewport,
        longitude: userLocation.coords.longitude,
        latitude: userLocation.coords.latitude,
        zoom: 16, // Closer zoom for mobile
        transitionDuration: 1000, // Smooth transition
      });
      setLocationAlert(true);
    }
  };
  
  // Toggle location tracking
  const toggleLocationTracking = () => {
    setLocationTrackingEnabled(prev => !prev);
    if (!locationTrackingEnabled && userLocation) {
      // If turning on tracking, jump to user location
      handleJumpToUserLocation();
    }
  };

  // Jump to user's location and optionally toggle tracking
  const handleLocationControl = () => {
    // If we already have user location, just jump to it
    if (userLocation) {
      handleJumpToUserLocation();
      
      // If user long-presses or double-clicks, toggle tracking
      if (locationControlTimer) {
        clearTimeout(locationControlTimer);
        setLocationControlTimer(null);
        // Toggle tracking on long press
        toggleLocationTracking();
        return;
      }
      
      // Set timer for detecting double click/long press
      setLocationControlTimer(
        setTimeout(() => {
          setLocationControlTimer(null);
        }, 300)
      );
    } else {
      // If no location yet, try to get it
      loadLocationAndUsers();
    }
    
    // Show feedback
    setLocationAlert(true);
  };

  // Load location and users data on component mount
  useEffect(() => {
    loadLocationAndUsers();
    
    // Setup location watching
    const watchId = watchUserLocation(
      (location) => {
        setUserLocation(location);
        // Update viewport if tracking is enabled
        if (locationTrackingEnabled) {
          setViewport(prev => ({
            ...prev,
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          }));
        }
      },
      (error) => {
        console.error('Error watching location:', error);
        setLocationError(error.message || 'Failed to track your location');
      }
    );
    
    // Store the watch ID in the ref
    locationWatchIdRef.current = watchId;
    
    // Cleanup function to stop watching location
    return () => {
      if (locationWatchIdRef.current) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
      }
    };
  }, [locationTrackingEnabled]);

  // Add current user to the map users
  useEffect(() => {
    if (user && userLocation) {
      // Check if the user is already in the allUsers array
      const userExists = allUsers.some(u => u.id === user.id);
      
      if (!userExists) {
        const currentUserMarker = {
          id: user.id || 'current-user',
          username: user.name || 'You',
          profilePicture: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'You')}&background=primary`,
          coordinates: [userLocation.coords.longitude, userLocation.coords.latitude],
          locationPrecision: 'Exact',
          onlineStatus: 'Online',
          lastActive: new Date().toISOString(),
          bio: 'This is you!',
          collectionStats: {
            totalCards: user.cards || 0,
            cardsForSale: 0,
            completedTrades: user.trades || 0
          },
          cards: []
        };
        
        setAllUsers(prevUsers => [currentUserMarker, ...prevUsers]);
      }
    }
  }, [user, userLocation, allUsers]);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* User Count Badge */}
      {!locationLoading && allUsers.length > 0 && (
        <Zoom in={true} style={{ transitionDelay: '500ms' }}>
          <Paper className="user-count-badge" elevation={6}>
            <Typography variant="body2" fontWeight="bold">
              👥 {allUsers.length} Collectors Nearby
            </Typography>
          </Paper>
        </Zoom>
      )}
      
      {/* Map component taking full screen */}
      <Box 
        ref={mapContainerRef}
        sx={{ width: '100%', height: '100%' }}
      >
        {/* Location loading state */}
        {locationLoading && (
          <Box 
            className="map-loading-gradient"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <CircularProgress 
              size={80} 
              thickness={4} 
              sx={{ 
                color: 'white',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }} 
            />
            <Typography variant="h5" sx={{ mt: 3, color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              🗺️ Finding Pokemon Collectors Near You...
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: 'rgba(255,255,255,0.9)' }}>
              Searching for nearby traders
            </Typography>
          </Box>
        )}
        
        {/* Location error state */}
        {locationError && (
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              zIndex: 10,
              p: 3
            }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                maxWidth: 500,
                borderRadius: 2,
                textAlign: 'center' 
              }}
            >
              <Typography variant="h5" color="error" gutterBottom>
                Location Error
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {locationError}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Using default location data instead. Some features may be limited.
              </Typography>
              <Fab
                color="primary"
                variant="extended"
                onClick={loadLocationAndUsers}
                sx={{ mt: 2 }}
              >
                <RefreshIcon sx={{ mr: 1 }} />
                Retry
              </Fab>
            </Paper>
          </Box>
        )}
        
        {/* Map loading state */}
        {!locationError && mapLoading && (
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(245, 247, 250, 0.8)',
              zIndex: 10
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading map...
            </Typography>
          </Box>
        )}
        
        {/* Map error state */}
        {mapError && (
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              zIndex: 10,
              p: 3
            }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                maxWidth: 500,
                borderRadius: 2,
                textAlign: 'center' 
              }}
            >
              <Typography variant="h5" color="error" gutterBottom>
                Map could not be loaded
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {mapError}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The map is using a hardcoded Mapbox token for local development.
              </Typography>
              <Fab
                color="primary"
                variant="extended"
                onClick={handleRetryMap}
                sx={{ mt: 2 }}
              >
                <RefreshIcon sx={{ mr: 1 }} />
                Retry
              </Fab>
            </Paper>
          </Box>
        )}
        
        {/* Action buttons with enhanced styling */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: isMobile ? 80 : 16,
            right: 16,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {/* Unified Location Control Button */}
          <Tooltip 
            title={locationTrackingEnabled ? "Location tracking active" : "Jump to my location"} 
            placement="left"
            arrow
          >
            <Fab
              color="primary"
              aria-label="my-location"
              className="map-control-fab fab-with-pulse"
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                }
              }}
              onClick={handleLocationControl}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MyLocationIcon sx={{ color: 'white', fontSize: 28 }} />
                
                {/* Location tracking indicator */}
                {locationTrackingEnabled && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                      border: '3px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      animation: 'tradePulse 1.5s infinite'
                    }}
                  />
                )}
              </Box>
            </Fab>
          </Tooltip>
          
          {/* Profile button */}
          <Tooltip title="View my profile" placement="left" arrow>
            <Fab
              color="secondary"
              aria-label="my-profile"
              className="map-control-fab"
              sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                }
              }}
              onClick={handleOpenUserProfile}
            >
              <PersonIcon sx={{ color: 'white', fontSize: 28 }} />
            </Fab>
          </Tooltip>
        </Box>

        <MapView 
          viewport={viewport}
          setViewport={setViewport}
          users={allUsers}
          onUserClick={handleUserClick}
          mapRef={mapRef}
          onLoad={handleMapLoad}
          onError={handleMapError}
          currentUser={user}
          onViewStateChange={(nextViewport) => {
            // This function is called when panning, zooming, or rotating
            if (nextViewport && nextViewport.viewState) {
              setViewport(nextViewport.viewState);
            }
          }}
        />
      </Box>

      {/* Mobile-optimized swipeable drawer */}
      {isMobile ? (
        <SwipeableDrawer
          anchor="bottom"
          open={sidebarOpen}
          onClose={handleCloseSidebar}
          onOpen={handleOpenSidebar}
          disableSwipeToOpen={false}
          swipeAreaWidth={30}
          PaperProps={{
            sx: {
              width: '100%',
              height: '80%',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              boxShadow: 12,
              overflow: 'visible',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 8,
                left: '50%',
                width: 40,
                height: 5,
                backgroundColor: theme.palette.grey[300],
                borderRadius: 4,
                transform: 'translateX(-50%)',
              }
            }
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {/* User sidebar content */}
          <UserSidebar 
            currentUser={user} 
            selectedUser={selectedUser}
            onClose={handleCloseSidebar}
            isMobile={isMobile}
          />
        </SwipeableDrawer>
      ) : (
        // Regular drawer for desktop
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={handleCloseSidebar}
          PaperProps={{
            sx: {
              width: 360,
              padding: 2,
              paddingTop: 0
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 1 }}>
            <IconButton onClick={handleCloseSidebar}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User sidebar content */}
          <UserSidebar 
            currentUser={user} 
            selectedUser={selectedUser}
            onClose={handleCloseSidebar}
            isMobile={isMobile}
          />
        </Drawer>
      )}

      {/* Location alert */}
      <Snackbar
        open={locationAlert}
        autoHideDuration={3000}
        onClose={() => setLocationAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setLocationAlert(false)}>
          Showing your current location
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MapPage;

