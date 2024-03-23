import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
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
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

const AddAuctionForm = () => {
  //const [registrationStartDate, setRegistrationStartDate] = useState("");
  //const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [maxBidIncrement, setMaxBidIncrement] = useState("");
  //const [registrationFee, setRegistrationFee] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  //const [deposit, setDeposit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  //const [approveTime, setApproveTime] = useState("");
  //const [status, setStatus] = useState("");
  //const [createByUserId, setCreateByUserId] = useState("");
  //const [approveByUserId, setApproveByUserId] = useState("");
  const [realEstateId, setRealEstateId] = useState("");
  const [RealEstates, setRealEstates] = useState("");

  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("loginUser");
  const jsonUser = JSON.parse(user);
  const theme = useTheme();
  const decode = jwtDecode(token);

  useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/RealEstate", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.pagingData)) {
          const estateData = response.data.data.pagingData.reduce(
            (acc, realEstate) => {
              if (realEstate.id && realEstate.name) {
                acc[realEstate.id] = realEstate.name;
              } else {
                console.error("Invalid realEstate data:", realEstate);
              }
              return acc;
            },
            {}
          );
          setRealEstates(estateData);
        } else {
          console.error("Invalid response data format:", response.data);
          setError("Invalid response data format. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error fetching realEstates:", error);
        setError("Error fetching realEstates. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEstateChange = (event) => {
    setRealEstateId(event.target.value);
  };

  function addIfNumber(formData, key, value) {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      formData.append(key, value);
    } else {
      console.error(`Giá trị cho ${key} không phải là một số hợp lệ: ${value}`);
    }
  }

  function addIfValidDate(formData, key, value) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      let formattedDate = date.toISOString(); // Corrected from startDate to date
      formData.append(key, formattedDate);
    } else {
      console.error(
        `Giá trị cho ${key} không phải là một ngày hợp lệ: ${value}`
      );
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    // addIfValidDate(formData, "registrationStartDate", registrationStartDate);
    // addIfValidDate(formData, "registrationEndDate", registrationEndDate);
    addIfNumber(formData, "startingPrice", startingPrice);
    addIfNumber(formData, "bidIncrement", bidIncrement);
    addIfNumber(formData, "maxBidIncrement", maxBidIncrement);
    // addIfNumber(formData, "registrationFee", registrationFee);
    // addIfNumber(formData, "deposit", deposit);
    addIfValidDate(formData, "startDate", startDate);
    addIfValidDate(formData, "endDate", endDate);
    // addIfValidDate(formData, "approveTime", approveTime);
    // formData.append("status", 0);
    // formData.append("createByUserId", jsonUser.id);
    // formData.append("approveByUserId", jsonUser.id);
    formData.append("realEstateId", realEstateId);

    axios({
      method: "post",
      url: "https://reasapiv2.azurewebsites.net/api/Auction/create-request",
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    })
      .then((response) => {
        setSuccessDialogOpen(true);
      })
      .catch((error) => {
        setError(error.response.data.message || "An error occurred");
        setErrorDialogOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    // Reset form fields after successful submission if needed
    // setRegistrationStartDate("");
    // setRegistrationEndDate("");
    setStartingPrice(0);
    setBidIncrement(0);
    setMaxBidIncrement(0);
    // setRegistrationFee(0);
    // setDeposit(0);
    setStartDate("");
    // setApproveTime("");
    // setStatus(0);
    // setCreateByUserId("");
    // setApproveByUserId("");
    setRealEstateId("");
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "65%",
        height: "100%",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Giá khởi điểm"
        value={startingPrice}
        onChange={(event) => setStartingPrice(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
      />
      <TextField
        label="Bước giá"
        value={bidIncrement}
        onChange={(event) => setBidIncrement(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
      />
      <TextField
        label="Bước giá tăng tối đá"
        value={maxBidIncrement}
        onChange={(event) => setMaxBidIncrement(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
      />
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Ngày bắt đầu đấu giá"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          fullWidth
          required
          margin="normal"
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider> */}
     

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimePicker',
          'MobileDateTimePicker',
          'DesktopDateTimePicker',
          'StaticDateTimePicker',
        ]}
      >
        <DemoItem label="Desktop variant">
          <DesktopDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Responsive variant">
          <DateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Static variant">
          <StaticDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
      <TextField
        label="Ngày kết thúc đấu giá"
        value={endDate}
        onChange={(event) => setEndDate(event.target.value)}
        fullWidth
        required
        margin="normal"
        type="date"
        sx={{ width: "100%" }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <FormControl fullWidth required margin="normal">
        <InputLabel>RealEstate</InputLabel>
        <Select value={realEstateId} onChange={handleEstateChange}>
          {Object.keys(RealEstates).length > 0 ? (
            Object.keys(RealEstates).map((realEstateId) => (
              <MenuItem key={realEstateId} value={realEstateId}>
                {RealEstates[realEstateId]} {/* Displaying estate name */}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        type="submit"
        sx={{ display: "block", mx: "auto", mt: 4 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          "Add Auction"
        )}
      </Button>
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>
          <TaskAltIcon />
        </DialogTitle>
        <DialogTitle variant="h3" align="center">
          Auction Added Successfully
        </DialogTitle>
        <DialogContent>
          <Typography align="center" variant="subtitle2">
            Your Auction has been successfully added.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={errorDialogOpen}
        onClose={handleErrorDialogClose}
      >
        <DialogTitle>
          <ErrorOutlineOutlinedIcon />
        </DialogTitle>
        <DialogTitle variant="h3" align="center">
          An Error Occurred
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" align="center">
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

export default AddAuctionForm;
