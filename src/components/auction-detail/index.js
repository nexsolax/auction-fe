import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SyncLockOutlinedIcon from "@mui/icons-material/SyncLockOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import axios from "axios";
import styled from "@emotion/styled";

const AutionDetailPage = () => {
  const [auctionData, setAuctionData] = useState({});
  const [registrationStartDate, setRegistrationStartDate] = useState("");
  const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [startingPrice, setStartingPrice] = useState(0);
  const [bidIncrement, setBidIncrement] = useState(0);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [approveTime, setApproveTime] = useState("");
  const [status, setStatus] = useState("");
  const [createByUserId, setCreateByUserId] = useState("");
  const [approveByUserId, setApproveByUserId] = useState("");
  const [realEstateId, setRealEstateId] = useState("");
  const [userBids, setUserBids] = useState([]);
  const [realEstates, setRealEstates] = useState({
    name: "",
    address: "",
    description: "",
    approveTime: "",
    status: "",
    categoryId: "",
    userId: "",
    approveByUserId: "",
    realEstateImages: [],
    id: "",
  });
  const [id, setId] = useState("");

  const token = localStorage.getItem("token");
  const [error, setError] = useState();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  const api = `https://reasapiv2.azurewebsites.net/api/Aution/id`;

  const Product = styled(Card)(({ theme }) => ({
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
  }));

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const styles = {
    TaskAltIcon: {
      fontSize: "150px",
      color: "#C3E1AE",
    },
    errorIcon: {
      fontSize: "150px",
      color: "#B5E4EB", // Adjust the size as needed // To center it vertically
    },
  };

  const fetchAuctionData = async () => {
    try {
      const response = await axios.get(api, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response && response.data) {
        console.log("Profile data:", response.data);
        setAuctionData(response.data);
      } else {
        console.log("Empty response or data from the server");
      }
    } catch (error) {
      console.log("Error fetching profile data:", error);
      // Handle the error state, such as displaying an error message to the user
    }
  };

  useEffect(() => {
    fetchAuctionData();
  }, []);

  if (
    auctionData &&
    auctionData.realEstates &&
    auctionData.realEstates.realEstateImages &&
    auctionData.realEstates.realEstateImages.length > 0
  ) {
    return (
      auctionData && (
        <Product>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={3}
            >
              <Avatar
                src={auctionData.realEstates.realEstateImages[0].image}
                alt="Avatar"
                sx={{ width: 150, height: 150, borderRadius: "50%" }}
              />
            </Box>
            <Grid container spacing={3}>
              <Grid
                container
                spacing={3}
                sx={{ marginTop: "25px", marginLeft: "2px" }}
              >
                <Grid item xs={6}>
                  <TextField
                    label="Ngày Bắt Đầu Đăng Ký"
                    fullWidth
                    value={registrationStartDate}
                    onChange={(e) => setRegistrationStartDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Ngày Kết Thúc Đăng Ký"
                    fullWidth
                    value={registrationEndDate}
                    onChange={(e) => setRegistrationEndDate(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                sx={{ marginTop: "5px", marginLeft: "2px" }}
              >
                <Grid item xs={6}>
                  <TextField
                    label="Giá Khởi Điểm"
                    fullWidth
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Tăng Giá Tối Thiểu"
                    fullWidth
                    value={bidIncrement}
                    onChange={(e) => setBidIncrement(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                sx={{ marginTop: "5px", marginLeft: "2px" }}
              >
                <Grid item xs={6}>
                  <TextField
                    label="Phí Đăng Ký"
                    fullWidth
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Tiền Đặt Cọc"
                    fullWidth
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                sx={{ marginTop: "5px", marginLeft: "2px" }}
              >
                <Grid item xs={6}>
                  <TextField
                    label="Ngày Bắt Đầu"
                    fullWidth
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Ngày Kết Thúc"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                sx={{ marginTop: "5px", marginLeft: "2px" }}
              >
                <Grid item xs={6}>
                  <TextField
                    label="Thời Gian Phê Duyệt"
                    fullWidth
                    value={approveTime}
                    onChange={(e) => setApproveTime(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Trạng Thái"
                    fullWidth
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                sx={{ marginTop: "5px", marginLeft: "2px" }}
              >
                <Grid item xs={6}>
                  <TextField
                    label="Người Tạo"
                    fullWidth
                    value={createByUserId}
                    onChange={(e) => setCreateByUserId(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Người Phê Duyệt"
                    fullWidth
                    value={approveByUserId}
                    onChange={(e) => setApproveByUserId(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                sx={{ marginTop: "5px", marginLeft: "2px" }}
              >
                <Grid item xs={6}>
                  <TextField
                    label="ID Bất Động Sản"
                    fullWidth
                    value={realEstateId}
                    onChange={(e) => setRealEstateId(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {Object.entries(realEstates).map(([key, value]) => (
                <Grid item xs={6} key={key}>
                  <TextField
                    label={key}
                    fullWidth
                    value={value}
                    onChange={(e) =>
                      setRealEstates((prevState) => ({
                        ...prevState,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
          <Dialog
            fullWidth
            maxWidth={maxWidth}
            open={errorDialogOpen}
            onClose={handleErrorDialogClose}
          >
            <DialogTitle sx={{ textAlign: "center" }}>
              <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
            </DialogTitle>
            <DialogTitle variant="h3" align="center">
              Đã có lỗi xảy ra lỗi{" "}
            </DialogTitle>
            <DialogContent>
              <Typography
                Typography
                variant="subtitle2"
                sx={{ marginBottom: "25px" }}
                align="center"
              >
                {error}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleErrorDialogClose}>OK</Button>
            </DialogActions>
          </Dialog>
        </Product>
      )
    );
  } else {
    return <div>No avatar found</div>;
  }
};

export default AutionDetailPage;
