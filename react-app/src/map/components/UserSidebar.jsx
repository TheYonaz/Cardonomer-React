import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Avatar, 
  Chip, 
  Divider, 
  Badge,
  Button,
  Paper,
  Grid
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ExactIcon from '@mui/icons-material/LocationOn';
import NeighborhoodIcon from '@mui/icons-material/LocationCity';
import CityIcon from '@mui/icons-material/Public';
import HiddenIcon from '@mui/icons-material/LocationOff';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import { formatDistance, calculateDistance } from '../services/LocationService';
import ROUTES from '../../router/routesModel';

const UserSidebar = ({ currentUser, selectedUser, onClose, isMobile }) => {
  const navigate = useNavigate();
  const user = selectedUser || currentUser;
  
  // Determine if this is the current user's profile
  const isCurrentUser = currentUser && user && currentUser.id === user.id;
  
  // Determine the appropriate location icon
  const getLocationIcon = (precision) => {
    switch (precision) {
      case 'Exact':
        return <ExactIcon color="success" />;
      case 'Neighborhood':
        return <NeighborhoodIcon color="info" />;
      case 'City':
        return <CityIcon color="warning" />;
      default:
        return <HiddenIcon color="error" />;
    }
  };
  
  // Format last active time
  const formatLastActive = (lastActive) => {
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffMs = now - lastActiveDate;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(e.target.alt || 'User')}&background=random`;
  };
  
  // Navigate to user profile
  const handleViewProfile = () => {
    if (user && (user._id || user.id)) {
      const userId = user._id || user.id;
      navigate(`${ROUTES.PROFILE}/${userId}`);
      if (onClose) onClose();
    }
  };
  
  // Handle chat initiation
  const handleStartChat = () => {
    // TODO: Integrate with existing chat system
    console.log('Starting chat with', user.username || `${user.name?.first} ${user.name?.last}`);
    // For now, show an alert - this should be replaced with actual chat integration
    alert(`Chat feature coming soon! You'll be able to message ${user.username || user.name?.first}`);
  };
  
  // If no user is available, show a message
  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">No User Selected</Typography>
        <Typography variant="body2" color="text.secondary">
          Select a user from the map to view their profile
        </Typography>
      </Box>
    );
  }
  
  // Calculate distance if both users have coordinates
  const calculateUserDistance = () => {
    if (
      currentUser && 
      selectedUser && 
      currentUser.coordinates && 
      selectedUser.coordinates
    ) {
      try {
        // Convert coordinates to proper format
        const point1 = {
          latitude: Array.isArray(currentUser.coordinates) 
            ? currentUser.coordinates[1] 
            : currentUser.coordinates.latitude,
          longitude: Array.isArray(currentUser.coordinates) 
            ? currentUser.coordinates[0] 
            : currentUser.coordinates.longitude
        };
          
        const point2 = {
          latitude: Array.isArray(selectedUser.coordinates) 
            ? selectedUser.coordinates[1] 
            : selectedUser.coordinates.latitude,
          longitude: Array.isArray(selectedUser.coordinates) 
            ? selectedUser.coordinates[0] 
            : selectedUser.coordinates.longitude
        };
        
        const distanceInMeters = calculateDistance(point1, point2);
        return formatDistance(distanceInMeters);
      } catch (error) {
        console.error('Error calculating distance:', error);
        return null;
      }
    }
    return null;
  };
  
  const distance = calculateUserDistance();
  
  return (
    <Box sx={{ 
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      pb: isMobile ? 6 : 2
    }}>
      {/* User Header with Avatar and Basic Info */}
      <Box 
        sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box
              component="span"
              sx={{
                width: 15,
                height: 15,
                borderRadius: '50%',
                bgcolor: user.onlineStatus === 'Online' ? 'success.main' : 
                         user.onlineStatus === 'Away' ? 'warning.main' : 'grey.500',
                border: '2px solid #fff'
              }}
            />
          }
        >
          <Avatar
            src={user.profilePicture}
            alt={user.username}
            sx={{ 
              width: isMobile ? 80 : 120, 
              height: isMobile ? 80 : 120,
              mb: 2,
              boxShadow: 2
            }}
            imgProps={{ onError: handleImageError }}
          />
        </Badge>
        
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {user.username}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          {getLocationIcon(user.locationPrecision)}
          <Typography variant="body2" color="text.secondary">
            {user.locationPrecision} Location
          </Typography>
        </Box>
        
        {distance && (
          <Chip 
            icon={<ExactIcon fontSize="small" />} 
            label={`${distance} away`} 
            color="primary" 
            size="small"
            sx={{ mt: 1 }}
          />
        )}
        
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <FiberManualRecordIcon 
              fontSize="inherit" 
              sx={{ 
                color: user.onlineStatus === 'Online' ? 'success.main' : 
                       user.onlineStatus === 'Away' ? 'warning.main' : 'grey.500',
              }} 
            />
            {user.onlineStatus} {user.onlineStatus !== 'Online' && `• Last active ${formatLastActive(user.lastActive)}`}
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      {/* Bio Section */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" paragraph>
          {user.bio || 'No bio available'}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Collection Stats */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" gutterBottom>
          Collection Stats
        </Typography>
        <Paper sx={{ p: 2, mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Cards:
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                {user.collectionStats?.totalCards || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Cards for Sale:
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                {user.collectionStats?.cardsForSale || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Completed Trades:
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                {user.collectionStats?.completedTrades || 0}
              </Typography>
            </Grid>
            {user.collectionStats?.rareCards !== undefined && (
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Rare Cards:
                </Typography>
                <Typography variant="h6" fontWeight="medium">
                  {user.collectionStats.rareCards}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ 
        mt: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {!isCurrentUser && (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<MessageIcon />}
              fullWidth
              onClick={handleStartChat}
            >
              Start Chat
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonIcon />}
              fullWidth
              onClick={handleViewProfile}
            >
              View Full Profile
            </Button>
          </>
        )}
        {isCurrentUser && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PersonIcon />}
            fullWidth
            onClick={handleViewProfile}
          >
            View My Profile
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UserSidebar;

