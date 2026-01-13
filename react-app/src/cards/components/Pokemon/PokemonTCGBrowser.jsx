import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';
import { useUser } from '../../../users/providers/UserProvider';
import PokemonTCGImporter from './PokemonTCGImporter';

// Create a separate axios instance for Pokemon TCG API (no auth token)
const pokemonTcgAxios = axios.create();

const PokemonTCGBrowser = () => {
  const { user } = useUser();
  
  // State management
  const [sets, setSets] = useState([]);
  const [selectedSetIndex, setSelectedSetIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('number'); // 'number', 'name', 'rarity'
  const [importerOpen, setImporterOpen] = useState(false);
  
  const API_KEY = '3485fea1-443a-4f5d-9082-4889d05b238e';
  const API_BASE = 'https://api.pokemontcg.io/v2';

  // Fetch all sets on mount
  useEffect(() => {
    fetchSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort cards when dependencies change
  useEffect(() => {
    if (cards.length > 0) {
      let filtered = [...cards];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(card => 
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (card.artist && card.artist.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply rarity filter
      if (filterRarity !== 'all') {
        filtered = filtered.filter(card => card.rarity === filterRarity);
      }
      
      // Apply type filter
      if (filterType !== 'all') {
        filtered = filtered.filter(card => 
          card.types && card.types.includes(filterType)
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'rarity':
            return (a.rarity || '').localeCompare(b.rarity || '');
          case 'number':
          default:
            return parseInt(a.number || 0) - parseInt(b.number || 0);
        }
      });
      
      setFilteredCards(filtered);
    }
  }, [cards, searchTerm, filterRarity, filterType, sortBy]);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const response = await pokemonTcgAxios.get(`${API_BASE}/sets`, {
        headers: {
          'X-Api-Key': API_KEY
        }
      });
      
      // Sort sets alphabetically by name
      const sortedSets = response.data.data.sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      
      setSets(sortedSets);
      setLoading(false);
      
      // Auto-load first set
      if (sortedSets.length > 0) {
        fetchCardsForSet(sortedSets[0].id);
      }
    } catch (error) {
      console.error('Error fetching sets:', error);
      setLoading(false);
    }
  };

  const fetchCardsForSet = async (setId) => {
    try {
      setCardsLoading(true);
      setCards([]);
      setFilteredCards([]);
      
      const response = await pokemonTcgAxios.get(`${API_BASE}/cards`, {
        params: {
          q: `set.id:${setId}`,
          pageSize: 250
        },
        headers: {
          'X-Api-Key': API_KEY
        }
      });
      
      setCards(response.data.data);
      setFilteredCards(response.data.data);
      setCardsLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setCardsLoading(false);
    }
  };

  const handleTabChange = (event, newIndex) => {
    setSelectedSetIndex(newIndex);
    const selectedSet = sets[newIndex];
    if (selectedSet) {
      fetchCardsForSet(selectedSet.id);
      // Reset filters when changing sets
      setSearchTerm('');
      setFilterRarity('all');
      setFilterType('all');
    }
  };
  
  // Swipe handlers for mobile
  const handleSwipeLeft = () => {
    if (selectedSetIndex < sets.length - 1) {
      handleTabChange(null, selectedSetIndex + 1);
    }
  };
  
  const handleSwipeRight = () => {
    if (selectedSetIndex > 0) {
      handleTabChange(null, selectedSetIndex - 1);
    }
  };
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 50
  });

  // Get unique rarities and types from current cards
  const availableRarities = [...new Set(cards.map(c => c.rarity).filter(Boolean))];
  const availableTypes = [...new Set(cards.flatMap(c => c.types || []))];

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'default',
      'Uncommon': 'primary',
      'Rare': 'secondary',
      'Rare Holo': 'secondary',
      'Rare Ultra': 'error',
      'Rare Secret': 'error',
      'Rare Rainbow': 'error',
      'Promo': 'warning'
    };
    return colors[rarity] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Grass': '#78C850',
      'Fire': '#F08030',
      'Water': '#6890F0',
      'Lightning': '#F8D030',
      'Psychic': '#F85888',
      'Fighting': '#C03028',
      'Darkness': '#705848',
      'Metal': '#B8B8D0',
      'Dragon': '#7038F8',
      'Fairy': '#EE99AC',
      'Colorless': '#A8A878'
    };
    return colors[type] || '#68A090';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading Pokemon TCG Sets...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Import Dialog */}
      <PokemonTCGImporter 
        open={importerOpen} 
        onClose={() => setImporterOpen(false)} 
      />

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🎴 Pokemon Trading Card Game Browser
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore all Pokemon TCG sets and cards with comprehensive details
          </Typography>
        </Box>
        {user?.isAdmin && (
          <Button
            variant="contained"
            startIcon={<CloudDownloadIcon />}
            onClick={() => setImporterOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              px: 3,
              py: 1.5,
              fontWeight: 'bold',
              boxShadow: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                boxShadow: 6,
              }
            }}
          >
            Import All Cards to DB
          </Button>
        )}
      </Box>

      {/* Horizontal Scrollable Set Tabs */}
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
        <Tabs
          value={selectedSetIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 200,
              maxWidth: 280,
              textTransform: 'none',
              fontWeight: 600,
              py: 2,
              px: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)',
                transform: 'translateY(-2px)'
              }
            },
            '& .Mui-selected': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              fontWeight: 700
            },
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
            },
            '& .MuiTabs-scrollButtons': {
              '&.Mui-disabled': {
                opacity: 0.3
              }
            }
          }}
        >
          {sets.map((set, index) => (
            <Tab
              key={set.id}
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <img 
                      src={set.images.symbol} 
                      alt=""
                      style={{ width: 24, height: 24, objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'inherit',
                        textAlign: 'left',
                        lineHeight: 1.3
                      }}
                      noWrap
                    >
                      {set.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`${set.total} cards`} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        bgcolor: selectedSetIndex === index ? 'primary.main' : 'grey.300',
                        color: selectedSetIndex === index ? 'white' : 'text.secondary'
                      }}
                    />
                    <Chip 
                      label={new Date(set.releaseDate).getFullYear()} 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Filters and Controls */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search cards by name or artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Rarity Filter */}
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Rarity</InputLabel>
                  <Select
                    value={filterRarity}
                    label="Rarity"
                    onChange={(e) => setFilterRarity(e.target.value)}
                  >
                    <MenuItem value="all">All Rarities</MenuItem>
                    {availableRarities.map(rarity => (
                      <MenuItem key={rarity} value={rarity}>{rarity}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Type Filter */}
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    label="Type"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {availableTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Sort */}
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="number">Card Number</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="rarity">Rarity</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* View Mode Toggle */}
              <Grid item xs={6} md={2}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton 
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            {/* Results count */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredCards.length} of {cards.length} cards
              </Typography>
            </Box>
          </Paper>

      {/* Swipeable Cards Display */}
      <Box {...swipeHandlers} sx={{ touchAction: 'pan-y', minHeight: '400px' }}>
        {cardsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Box textAlign="center">
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>Loading cards...</Typography>
            </Box>
          </Box>
        ) : (
          <>
            <Grid container spacing={viewMode === 'grid' ? 2 : 1}>
              {filteredCards.map((card) => (
                <Grid 
                  item 
                  xs={viewMode === 'grid' ? 6 : 12} 
                  sm={viewMode === 'grid' ? 4 : 12} 
                  md={viewMode === 'grid' ? 3 : 12} 
                  lg={viewMode === 'grid' ? 2 : 12} 
                  key={card.id}
                >
                  <Card sx={{ 
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: viewMode === 'grid' ? 'scale(1.05)' : 'translateX(4px)',
                      boxShadow: 4
                    }
                  }}>
                    <Box sx={{ display: viewMode === 'list' ? 'flex' : 'block' }}>
                      <CardMedia
                        component="img"
                        image={card.images.small}
                        alt={card.name}
                        sx={{ 
                          width: viewMode === 'list' ? 150 : '100%',
                          height: viewMode === 'list' ? 150 : 'auto',
                          objectFit: 'contain',
                          p: 1,
                          bgcolor: '#f9f9f9'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <CardContent sx={{ pb: 1 }}>
                          <Typography variant={viewMode === 'grid' ? 'subtitle2' : 'h6'} gutterBottom noWrap title={card.name}>
                            {card.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            #{card.number} • {card.supertype}
                          </Typography>
                          {card.types && (
                            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {card.types.map(type => (
                                <Chip
                                  key={type}
                                  label={type}
                                  size="small"
                                  sx={{
                                    bgcolor: getTypeColor(type),
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                          {card.rarity && (
                            <Chip
                              label={card.rarity}
                              size="small"
                              color={getRarityColor(card.rarity)}
                              sx={{ mt: 1 }}
                            />
                          )}
                          {card.hp && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              HP: {card.hp}
                            </Typography>
                          )}
                          {card.artist && viewMode === 'list' && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                              Artist: {card.artist}
                            </Typography>
                          )}
                        </CardContent>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {filteredCards.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No cards found matching your filters
                </Typography>
              </Paper>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default PokemonTCGBrowser;

