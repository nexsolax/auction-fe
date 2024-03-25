import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from '@mui/material';
import axios from 'axios';

const CloseAuctionForm = () => {
  const [auctionId, setAuctionId] = useState('');
  const [auctions, setAuctions] = useState('');
  const [realEstateId, setRealEstateId] = useState('');
  const [realEstates, setRealEstates] = useState('');
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const theme = useTheme();

  useEffect(() => {
    axios
      .get(
        `https://reasapiv2.azurewebsites.net/api/RealEstate/${realEstateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.pagingData)) {
          const estateData = response.data.data.pagingData.reduce(
            (acc, realEstate) => {
              if (realEstate.id && realEstate.name) {
                acc[realEstate.id] = realEstate.name;
              } else {
                console.error('Invalid realEstate data:', realEstate);
              }
              return acc;
            },
            {}
          );
          setRealEstates(estateData);
        } else {
          console.error('Invalid response data format:', response.data);
          setError('Invalid response data format. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error fetching realEstates:', error);
        setError('Error fetching realEstates. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios
      .get('https://reasapiv2.azurewebsites.net/api/Auction', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.pagingData)) {
          setAuctions(response.data.data.pagingData);
        } else {
          console.error('Invalid response data format:', response.data);
          setError('Invalid response data format. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error fetching realEstates:', error);
        setError('Error fetching realEstates. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEstateChange = (event) => {
    const selectedRealEstateId = event.target.value;
    setRealEstateId(selectedRealEstateId);

    // Tìm auctionId tương ứng với realEstateId được chọn
    const selectedAuction = auctions.find(
      (auction) => auction.realEstateId === selectedRealEstateId
    );
    if (selectedAuction) {
      setAuctionId(selectedAuction.id);
    } else {
      setAuctionId('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    axios
      .patch(
        `https://reasapiv2.azurewebsites.net/api/Auction/${auctionId}/close`,
        {},
        config
      )
      .then((response) => {
        console.log(response.data.data);
        setLoading(false);
        setSuccessDialogOpen(true);
        // navigation(`${response.data.data}`);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    // Reset form fields after successful submission if needed
    setRealEstateId('');
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Box
      component='form'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '65%',
        height: '100%',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        [theme.breakpoints.down('md')]: {
          width: '100%',
        },
      }}
      onSubmit={handleSubmit}
    >
      <FormControl fullWidth required margin='normal'>
        <InputLabel>RealEstate</InputLabel>
        <Select value={realEstateId} onChange={handleEstateChange}>
          {Object.keys(realEstates).length > 0 ? (
            Object.keys(realEstates).map((realEstateId) => (
              <MenuItem key={realEstateId} value={realEstateId}>
                {realEstates[realEstateId]} {/* Displaying estate name */}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </Select>
      </FormControl>

      <Button
        variant='contained'
        color='primary'
        fullWidth
        type='submit'
        sx={{ display: 'block', mx: 'auto', mt: 4 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress color='inherit' size={24} />
        ) : (
          'Đóng đấu giá'
        )}
      </Button>

      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>
          <TaskAltIcon />
        </DialogTitle>
        <DialogTitle variant='h3' align='center'>
          Đóng đấu giá thành công
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={errorDialogOpen}
        onClose={handleErrorDialogClose}
      >
        <DialogTitle>
          <ErrorOutlineOutlinedIcon />
        </DialogTitle>
        <DialogTitle variant='h3' align='center'>
          An Error Occurred
        </DialogTitle>
        <DialogContent>
          <Typography variant='subtitle2' align='center'>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CloseAuctionForm;
