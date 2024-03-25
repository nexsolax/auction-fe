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

const EstateDetailPage = () => {
  const [realEstateData, setRealEstateData] = useState({});
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [approveTime, setApproveTime] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const [approveByUserId, setApproveByUserId] = useState("");
  const [realEstateImages, setRealEstateImages] = useState([]);
  const [id, setId] = useState("");

  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  const api = `https://reasapiv2.azurewebsites.net/api/RealEstate/`;

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

  const fetchEstateData = async () => {
    try {
      const response = await axios.get(api, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response && response.data.data.pagingData) {
        console.log("estate data:", response.data);
        setRealEstateData(response.data);
      } else {
        console.log("Empty response or data from the server");
      }
    } catch (error) {
      console.log("Error fetching profile data:", error);
      // Handle the error state, such as displaying an error message to the user
    }
  };

  useEffect(() => {
    fetchEstateData();
  }, []);

  if (
    realEstateData &&
    realEstateData.realEstates &&
    realEstateData.realEstates.realEstateImages &&
    realEstateData.realEstates.realEstateImages.length > 0
  ) {
    return (
      realEstateData && (
        <Product>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={3}
            >
              <Avatar
                src={realEstateData.realEstates.realEstateImages[0].image}
                alt="Avatar"
                sx={{ width: 150, height: 150, borderRadius: "50%" }}
              />
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  label="Tên Bất Động Sản"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Địa Chỉ"
                  fullWidth
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  label="Mô Tả"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Thời Gian Phê Duyệt"
                  fullWidth
                  value={approveTime}
                  onChange={(e) => setApproveTime(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  label="Trạng Thái"
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Danh Mục ID"
                  fullWidth
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  label="Người Dùng ID"
                  fullWidth
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Người Phê Duyệt ID"
                  fullWidth
                  value={approveByUserId}
                  onChange={(e) => setApproveByUserId(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* Real Estate Images Section */}
                <Typography variant="h6" gutterBottom>
                  Hình Ảnh Bất Động Sản
                </Typography>
                {/* Render each image */}
                {realEstateImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    style={{
                      width: "100%",
                      maxWidth: "200px",
                      marginBottom: "10px",
                    }}
                  />
                ))}
              </Grid>
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

export default EstateDetailPage;
