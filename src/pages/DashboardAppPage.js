import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SearchIcon from '@mui/icons-material/Search';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
// components
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axiosInstance from '../services/axios-instance';
import Iconify from '../components/iconify';
// sections


// ----------------------------------------------------------------------

export default function DashboardAppPage() {


  const user = JSON.parse(localStorage.getItem('loginUser'));

  

  return (
    <>
      <Helmet>
        <title> Tổng quan | REAs </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Xin chào {user?.unique_name}
        </Typography>

        
      </Container>

    </>
  );
}
