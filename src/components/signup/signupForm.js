import React, { useRef, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
// import { Uploader } from "uploader";
// import { UploadDropzone } from "react-uploader";
import { format } from "date-fns";
import axios from "axios";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

const SignUpForm = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [paypalAccount, setPaypalAccount] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [cccdnumber, setCitizenId] = useState("");
  const [err, setError] = useState("");
  const MAX_FILE_SIZE = 23 * 1024 * 1024; // 23 MB in bytes
  const [avatar, setAvatar] = useState(null);
  const [cccdfrontImage, setFrontImage] = useState(null);
  const [cccdbackImage, setBackImage] = useState(null);
  // const [otpValue, setOtpValue] = useState('');
  // const [otpError, setOtpError] = useState(false);
  // const otpInputRef = useRef('');
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("loginUser");
  const jsonUser = JSON.parse(user);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateRoleMessage, setUpdateRoleMessage] = useState("");
  const [checkboxError, setCheckboxError] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  // const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [roleUpgradeSuccess, setRoleUpgradeSuccess] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleDialogClose1 = () => {
    // setOtpDialogOpen(false);
    setDialogOpen(false);
    setUpdateRoleMessage(""); // If needed to clear the updateRoleMessage state
  };

  const handleUpgradeToAuctioneer = async () => {
    // const otpValue = otpInputRef.current.value;
    setRoleUpgradeSuccess(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !userName ||
      !email ||
      !password ||
      !rePassword ||
      !address ||
      !phone ||
      !dateOfBirth
    ) {
      setError("Không Được Bỏ Trống");
      setErrorDialogOpen(true);
      return;
    }

    if (password.length < 8) {
      setError("Mật Khẩu Cần Ít Nhất 8 Ký Tự");
      setErrorDialogOpen(true);
      return;
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      setError("Sai Kiểu email, Ví Dụ: example@gmail.com");
      setErrorDialogOpen(true);
      return;
    }

    if (password !== rePassword) {
      setError("Mật Khẩu Không Chính Xác");
      setErrorDialogOpen(true);
      return;
    }
    // if (!avatar || !cccdfrontImage || !cccdbackImage) {
    //   setError('Vui lòng tải lên đủ 3 hình ảnh (Ảnh đại diện, Mặt trước CCCD, Mặt sau CCCD).');
    //   setErrorDialogOpen(true);
    //   return;
    // }
    // if (!isCheckboxChecked) {
    //   setCheckboxError(true); // Set checkbox error when not checked
    //   return;
    // }
    // setIsLoading(true);

    const date = format(new Date(dateOfBirth.toISOString));
    console.log(date);
    function displayImage(event) {
      const selectedImage = document.getElementById("selectedImage");
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          selectedImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
      }
    }

    try {
      const response = await axios
        .post("https://reasapiv2.azurewebsites.net/api/User", {
          userName,
          email,
          password,
          address,
          phone,
          dateOfBirth: date,
          cccdnumber,
          avatar,
          cccdfrontImage,
          cccdbackImage,
        })
        .then((data) => {
          console.log(data);
          const userID = data.data.userId;
          console.log(userID);
          const paypalData = {
            userId: userID,
            paypalAccount,
          };

          axios
            .post(
              "https://reasapiv2.azurewebsites.net/api/BankAccount",
              paypalData
            )

            .catch((err) => {
              if (err.response.status === 400) {
                setIsLoading(false);
                const errorMessage = err.response.data; // Assuming the error message is in the response data
                console.log("Error:", errorMessage);
                err = setError(errorMessage);
                setErrorDialogOpen(true);
              }
            })
            .then((response) => {
              setIsLoading(false);
              setSuccessDialogOpen(true);
            });

          // These statements should not be inside the inner .then block
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setIsLoading(false);
            const errorMessage = err.response.data; // Assuming the error message is in the response data
            console.log("Error:", errorMessage);
            err = setError(errorMessage);
            setErrorDialogOpen(true);
          }
          console.log("Server response:", response.data);
        });

      console.log("Server response:", response.data);
      setSuccessDialogOpen(true);

      // Reset form fields
      setUserName("");
      setEmail("");
      setPassword("");
      setRePassword("");
      setAddress("");
      setPhoneNumber("");
      setDateOfBirth("");
      setCitizenId("");
      setAvatar(null);
      setFrontImage(null);
      setBackImage(null);
      setError("");
    } catch (error) {
      // console.error('Error:', error.response);
    }
  };

  const handleSuccessDialogClose = () => {
    navigate("/home", { replace: true });
    setSuccessDialogOpen(false);
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
    setCheckboxError(false);
  };

  const styles = {
    errorIcon: {
      fontSize: "150px",
      color: "#B5E4EB", // Adjust the size as needed // To center it vertically
    },
    TaskAltIcon: {
      fontSize: "150px",
      color: "#C3E1AE",
    },
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
      <Grid container>
        <Grid xs={6}>
          <TextField
            label="Tên Tài Khoản"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            margin="normal"
            required
            sx={{ width: "100%" }}
            id="userName"
          />
        </Grid>
        <Grid xs={6}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            disabled={emailDisabled}
            required
            sx={{ width: "100%", marginLeft: "5px" }}
            id="email"
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid xs={6}>
          <TextField
            label="Mật Khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            sx={{ width: "100%" }}
            id="password"
            // disabled={!roleUpgradeSuccess}
          />
        </Grid>
        <Grid xs={6}>
          <TextField
            label="Nhập Lại Mật Khẩu"
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            margin="normal"
            required
            sx={{ width: "100%", marginLeft: "5px" }}
            id="rePassword"
            // disabled={!roleUpgradeSuccess}
          />
        </Grid>
      </Grid>

      <TextField
        label="Tài Khoản ngân hàng"
        type="text"
        value={paypalAccount}
        onChange={(e) => setPaypalAccount(e.target.value)}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="paypal"
        // disabled={!roleUpgradeSuccess}
      />
      <TextField
        label="Địa Chỉ"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="address"
        multiline
        rows={2}
        // disabled={!roleUpgradeSuccess}
      />

      <Grid container>
        <Grid xs={6}>
          <TextField
            label="Số Điện Thoại"
            type="tel"
            value={phone}
            onChange={(e) => setPhoneNumber(e.target.value)}
            margin="normal"
            required
            sx={{ width: "100%" }}
            id="phone"
            // disabled={!roleUpgradeSuccess}
          />
        </Grid>
        <Grid xs={6}>
          <TextField
            label=" Tháng, Ngày, Năm Sinh"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            margin="normal"
            required
            sx={{ width: "100%", marginLeft: "5px" }}
            id="dateOfBirth"
            InputLabelProps={{
              shrink: true,
            }}
            // disabled={!roleUpgradeSuccess}
          />
        </Grid>
      </Grid>

      <TextField
        label="Số CCCD"
        type="text"
        value={cccdnumber}
        onChange={(e) => setCitizenId(e.target.value)}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="cccdnumber"
        disabled={!roleUpgradeSuccess}
      />

      {/* {err && (
        <Typography variant="body2" color="error" sx={{ marginTop: '10px' }}>
          {err}
        </Typography>
      )} */}

      {/* <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={isCheckboxChecked}
            disabled={!roleUpgradeSuccess}
            onChange={(e) => {
              setIsCheckboxChecked(e.target.checked);
              setCheckboxError(false); // Clear checkbox error when checked
            }}
          />
        }
        label="Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá (Quy định theo tài sản đấu giá), Chính sách bảo mật thông tin khách hàng, Cơ chế giải quyết tranh chấp, Quy chế hoạt động tại website đấu giá trực tuyến của REAs."
      /> */}

      {/* <Dialog fullWidth maxWidth={maxWidth} open={otpDialogOpen} onClose={handleCloseOtpDialog}>


        <DialogTitle sx={{ textAlign: 'center', }}> <ErrorOutlineOutlinedIcon style={styles.errorIcon} /> </DialogTitle>
        <DialogTitle variant='h3' align='center' >Xác nhận mã OTP</DialogTitle>
        <DialogContent>
          <Typography variant='subtitle2' sx={{ marginBottom: "25px" }} align='center'>Hãy nhập mã OTP đã được gửi về địa chỉ email mà bạn đã đăng kí </Typography>
          <TextField
            label="OTP"
            fullWidth
            inputRef={otpInputRef}
            onChange={handleOtpInputChange}
            error={otpError}
            helperText={otpError ? 'Kiểm Tra Lại Mã OTP' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtpDialog} color="secondary">
            Thoát
          </Button>
          <Button onClick={handleUpgradeToAuctioneer} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog> */}

      <Dialog
        fullWidth
        maxWidth={maxWidth}
        open={!!updateRoleMessage}
        onClose={handleDialogClose1}
      >
        <DialogTitle fullWidth maxWidth={maxWidth} sx={{ textAlign: "center" }}>
          {" "}
          <ErrorOutlineOutlinedIcon style={styles.errorIcon} />{" "}
        </DialogTitle>
        <DialogContent>
          <Typography align="center">{updateRoleMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose1} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth={maxWidth}
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
      >
        <DialogTitle sx={{ marginTop: "25px", textAlign: "center" }}>
          {" "}
          <TaskAltIcon style={styles.TaskAltIcon} />{" "}
        </DialogTitle>
        <DialogTitle DialogTitle variant="h3" align="center">
          Đã đăng kí tài Khoản.
        </DialogTitle>
        <DialogContent>
          <Typography align="center" variant="subtitle2">
            Tài Khoản của bạn đã được tạo thành công. Vui lòng chờ Admin hệ
            thống xét duyệt Tài Khoản của bạn.{" "}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        fullWidth
        maxWidth={maxWidth}
        open={errorDialogOpen || checkboxError}
        onClose={handleErrorDialogClose}
      >
        <DialogTitle fullWidth maxWidth={maxWidth} sx={{ textAlign: "center" }}>
          {" "}
          <ErrorOutlineOutlinedIcon style={styles.errorIcon} />{" "}
        </DialogTitle>
        <DialogTitle align="center">Đã xảy ra lỗi</DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center">
            {checkboxError ? "Bạn cần chấp nhận điều khoản và điều kiện." : err}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Button
        endIcon={<PersonAddIcon />}
        style={{ width: "200px" }}
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: "20px" }}
        // disabled={!roleUpgradeSuccess || isLoading} // Disable when loading
      >
        {isLoading ? <CircularProgress size={24} /> : "Đăng Kí"}
      </Button>
    </Box>
  );
};

export default SignUpForm;
