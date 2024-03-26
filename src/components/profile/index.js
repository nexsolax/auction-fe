import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import SyncLockOutlinedIcon from '@mui/icons-material/SyncLockOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import axios from 'axios';
import styled from '@emotion/styled';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({});
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user)
    const [open, setOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState();
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const oldPasswordRef = useRef('');
    const newPasswordRef = useRef('');
    const reNewPassword = useRef('');
    const reUserName = useRef('');
    const reAddress = useRef('');
    const rePhone = useRef('');
    const rePaypalAccount = useRef('');
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [isUpdating, setIsUpdating] = useState(false);
    const decoded = jwtDecode(token);

    // const ChangePasswordApi = `https://reasapiv2.azurewebsites.net/api/User/update_password`
    const api = `https://reasapiv2.azurewebsites.net/api/User/${jsonUser.id}`
    const apiUpdateInfo = `https://reasapiv2.azurewebsites.net/api/User/${jsonUser.id}`
    // const apiUpdatePaypal = `https://reasapiv2.azurewebsites.net/api/UserPaymentInformation`


    const Product = styled(Card)(({ theme }) => ({

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
    }));


    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);

    };

    const handleOpenDialog = () => {
        setOpen(true);
        setPasswordError(false);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        // setPasswordError(false);
    };

    const handleOpenSuccessDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseSuccessDialog = () => {
        fetchProfileData();
        setDialogOpen(false);
        // setPasswordError(false);
    };

    const styles = {
        TaskAltIcon: {
            fontSize: '150px',
            color: '#C3E1AE'
        },
        errorIcon: {
            fontSize: '150px',
            color: '#B5E4EB' // Adjust the size as needed // To center it vertically
        },
    };


    

    const formatProfileData = (data) => {
        const formattedDateOfBirth = formatDate(data.dateOfBirth);
        const formattedCreateDate = formatDate(data.createDate);

        return {
            ...data,
            dateOfBirth: formattedDateOfBirth,
            createDate: formattedCreateDate,
        };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${year}-${month}-${day}`;
    };

    const fetchProfileData = async () => {
        try {
            const response = await axios.get(api, { headers: { Authorization: `Bearer ${decoded}` } });
            if (response && response.data) {
                console.log('Profile data:', response.data);
                setProfileData(response.data);
            } else {
                console.log('Empty response or data from the server');
            }
        } catch (error) {
            console.log('Error fetching profile data:', error);
            // Handle the error state, such as displaying an error message to the user
        }
    };

    useEffect(() => {
        fetchProfileData();
        console.log(jsonUser.id);
        console.log(decoded);
    }, []);


    if (profileData && profileData.data && profileData.data.avatar) {
        return (
            profileData && (
              <Product>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={3}
                  >
                    <Avatar
                      src={profileData.data.avatar}
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
                          inputRef={reUserName}
                          label="Tên Tài Khoản"
                          fullWidth
                          defaultValue={profileData.data.name || ""}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Email"
                          fullWidth
                          value={profileData.data.email || ""}
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
                          label="Role"
                          disabled
                          fullWidth
                          value={profileData.data.role || ""}
                        />
                      </Grid>
      
                      <Grid item xs={6}>
                        <TextField
                          label="Password"
                          type="password"
                          fullWidth
                          value={profileData.data.password || ""}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                {/* "Đổi mật khẩu" Icon Button */}
                                <IconButton onClick={handleOpenDialog} size="small">
                                  <SyncLockOutlinedIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
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
                          label="Số Điện Thoại"
                          fullWidth
                          defaultValue={profileData.data.phoneNumber || ""}
                          inputRef={rePhone}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Số CCCD"
                          fullWidth
                          value={profileData.data.identityNumber || ""}
                        />
                      </Grid>
                    </Grid>
      
                    <Grid item xs={12}>
                      <TextField
                        label="Địa Chỉ"
                        multiline
                        rows={4}
                        fullWidth
                        defaultValue={profileData.data.address || ""}
                        inputRef={reAddress}
                      />
                    </Grid>
                    <Grid
                      container
                      spacing={3}
                      sx={{ marginTop: "5px", marginLeft: "2px" }}
                    >
                     
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <img
                        src={profileData.data.identityCardFrontImage}
                        alt="CCCD Front"
                        style={{
                          width: "100%",
                          height: "250px",
                          border: "1px dashed #ccc",
                          borderRadius: "4px",
                          padding: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <img
                        src={profileData.data.identityCardBackImage}
                        alt="CCCD Back"
                        style={{
                          width: "100%",
                          height: "250px",
                          border: "1px dashed #ccc",
                          borderRadius: "4px",
                          padding: "4px",
                        }}
                      />
                    </Grid>
                    
                  </Grid>
                </CardContent>
    
      
                <Dialog open={open} onClose={handleCloseDialog}>
                  <DialogContent>
                    <DialogTitle align="center" variant="h4">
                      Thay Đổi Mật Khẩu
                    </DialogTitle>
                    <TextField
                      label="Mật Khẩu cũ"
                      type="password"
                      fullWidth
                      inputRef={oldPasswordRef}
                      error={passwordError}
                      helperText={passwordError ? "Mật khẩu cũ không đúng" : ""}
                      sx={{ marginBottom: "16px" }}
                    />
                    <TextField
                      label="Mật Khẩu mới"
                      type="password"
                      fullWidth
                      inputRef={newPasswordRef}
                      sx={{ marginBottom: "16px" }}
                      error={passwordError || passwordMatchError} // Highlight the field for both errors
                      helperText={
                        passwordError
                          ? "Mật khẩu phải có ít nhất 8 ký tự"
                          : passwordMatchError
                          ? "Mật khẩu không khớp"
                          : ""
                      }
                    />
      
                    <TextField
                      label="Nhập lại Mật Khẩu mới"
                      type="password"
                      fullWidth
                      inputRef={reNewPassword}
                      sx={{ marginBottom: "16px" }}
                      error={passwordMatchError} // Highlight the field if there's a match error
                      helperText={passwordMatchError ? "Mật khẩu không khớp" : ""}
                    />
                  </DialogContent>
      
                  <DialogActions>

                  </DialogActions>
                </Dialog>
      
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

export default ProfilePage;
