import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { importAllPokemonCards } from '../../services/pokemonTCGImporter';

const PokemonTCGImporter = ({ open, onClose }) => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({
    stage: null,
    current: 0,
    total: 0,
    setName: '',
    cardCount: 0,
    totalCards: 0
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    setResult(null);
    
    try {
      const importResult = await importAllPokemonCards((progressData) => {
        setProgress(progressData);
      });
      
      setResult(importResult);
      setImporting(false);
    } catch (err) {
      setError(err.message || 'Import failed');
      setImporting(false);
    }
  };

  const handleClose = () => {
    if (!importing) {
      onClose();
      // Reset state after closing
      setTimeout(() => {
        setProgress({
          stage: null,
          current: 0,
          total: 0,
          setName: '',
          cardCount: 0,
          totalCards: 0
        });
        setResult(null);
        setError(null);
      }, 300);
    }
  };

  const getProgressPercentage = () => {
    if (progress.total === 0) return 0;
    return Math.round((progress.current / progress.total) * 100);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={importing}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <CloudDownloadIcon />
        <Box>
          <Typography variant="h6">
            Pokemon TCG Database Importer
          </Typography>
          <Typography variant="caption">
            Import all Pokemon TCG cards into your database
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {!importing && !result && !error && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              This will fetch ALL Pokemon TCG cards from ALL sets and save them to your database.
              <br />
              <strong>This process may take several minutes and will fetch thousands of cards.</strong>
            </Typography>
          </Alert>
        )}

        {/* Progress Display */}
        {importing && (
          <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {progress.stage === 'fetching' ? '📥 Fetching from API' : '💾 Saving to Database'}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {progress.current} / {progress.total}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getProgressPercentage()} 
                sx={{ height: 10, borderRadius: 1, mb: 2 }}
              />
              <Typography variant="body1" gutterBottom>
                {progress.setName}
              </Typography>
              {progress.stage === 'fetching' && (
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Chip 
                    label={`${progress.cardCount} cards in set`} 
                    size="small" 
                    color="primary"
                  />
                  <Chip 
                    label={`${progress.totalCards} total cards fetched`} 
                    size="small" 
                    color="secondary"
                  />
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {/* Success Result */}
        {result && (
          <Paper elevation={2} sx={{ p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">
                  Import Successful!
                </Typography>
                <Typography variant="body2">
                  All cards have been imported into your database
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Total Sets" 
                  secondary={result.totalSets}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 'bold' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Total Cards" 
                  secondary={result.totalCards}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 'bold' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Batches Processed" 
                  secondary={result.saveResult?.totalBatches}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 'bold' } }}
                />
              </ListItem>
            </List>
          </Paper>
        )}

        {/* Error Display */}
        {error && (
          <Paper elevation={2} sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ErrorIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6">
                  Import Failed
                </Typography>
                <Typography variant="body2">
                  {error}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Instructions */}
        {!importing && !result && (
          <Paper elevation={1} sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What will happen:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="1. Fetch all sets from Pokemon TCG API (sorted alphabetically)"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="2. Fetch all cards from each set (may take 5-10 minutes)"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="3. Normalize card data to match database schema"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="4. Save cards to database in batches of 500"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={importing}
          color="inherit"
        >
          {result ? 'Close' : 'Cancel'}
        </Button>
        {!result && (
          <Button 
            onClick={handleImport}
            disabled={importing}
            variant="contained"
            startIcon={<CloudDownloadIcon />}
          >
            {importing ? 'Importing...' : 'Start Import'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PokemonTCGImporter;

