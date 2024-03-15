import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { createStaff } from "../../services/staff-actions";

const StaffCreateNew = () => {
  const [newStaff, setNewStaff] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: 0,
    identityNumber: "",
    avatar: "",
    identityCardProvideDate: "",
    identityCardFrontImage: "",
    identityCardBackImage: "",
    role: 0,
    status: 0,
  });

  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const handleGenderChange = (value) => {
    setNewStaff({ ...newStaff, gender: value });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      convertImageToString(file).then((result) => {
        setAvatar(result);
        setNewStaff({ ...newStaff, avatar: result });
      });
    }
  };

  const handleFrontImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      convertImageToString(file).then((result) => {
        setFrontImage(result);
        setNewStaff({ ...newStaff, identityCardFrontImage: result });
      });
    }
  };

  const handleBackImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      convertImageToString(file).then((result) => {
        setBackImage(result);
        setNewStaff({ ...newStaff, identityCardBackImage: result });
      });
    }
  };

  const convertImageToString = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = URL.createObjectURL(file);
        resolve(imageUrl);
      };
      reader.readAsDataURL(file);
    });
  };
  

  const handleCancel = () => {
    navigate("/dashboard/staff", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newStaff.name ||
      !newStaff.userName ||
      !newStaff.email ||
      !newStaff.password ||
      !newStaff.address ||
      !newStaff.phoneNumber ||
      !newStaff.dateOfBirth ||
      !newStaff.gender ||
      // !newStaff.avatar ||
      !newStaff.identityNumber ||
      !newStaff.identityCardProvideDate
      // !newStaff.identityCardBackImage ||
      // !newStaff.identityCardFrontImage
    ) {
      setError("Không Được Bỏ Trống");
      return;
    }

    if (newStaff.password.length < 8) {
      setError("Mật Khẩu Cần Ít Nhất 8 Ký Tự");
      return;
    }

    if (
      !newStaff.email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      setError("Sai Kiểu email, Ví Dụ: example@gmail.com");
      return;
    }

    if (newStaff.password !== rePassword) {
      setError("Mật Khẩu Không Giống");
      return;
    }

    try {
      const formattedDateOfBirth = format(
        new Date(newStaff.dateOfBirth),
        "yyyy-MM-ddTHH:mm:ss.SSSz"
        );

      const formattedIdentityCardProvideDate = format(
        new Date(newStaff.identityCardProvideDate),
        "yyyy-MM-ddTHH:mm:ss.SSSSSz" // Change the format to match the API
      );

      const requestData = {
        name: newStaff.name,
        email: newStaff.email,
        phoneNumber: newStaff.phoneNumber,
        userName: newStaff.userName,
        password: newStaff.password,
        gender: parseInt(newStaff.gender),
        address: newStaff.address,
        identityNumber: "string",
        identityCardProvideDate: formattedIdentityCardProvideDate,
        identityCardFrontImage: "string",
        identityCardBackImage: "string",
        avatar: "string",
        role: 0, // Ensure role is an integer
        status: 0 // Ensure status is an integer
      };

      await createStaff(requestData);
      navigate("/dashboard/staff", { replace: true });
      setSuccessDialogOpen(true);
      setNewStaff({
        name: "",
        userName: "",
        email: "",
        password: "",
        address: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: 0,
        identityNumber: "",
        avatar: "",
        identityCardProvideDate: "",
        identityCardFrontImage: "",
        identityCardBackImage: "",
        role: 0,
        status: 0,
      });
      setRePassword("");
      setError("");
      toast.success("Tạo nhân viên thành công", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error:", error);
      setErrorDialogOpen(true);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Box
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
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Tạo tài khoản cho nhân viên
      </Typography>
      <TextField
        label="Họ và tên"
        type="text"
        value={newStaff.name}
        onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="name"
      />
      <TextField
        label="User name"
        type="text"
        value={newStaff.userName}
        onChange={(e) => setNewStaff({ ...newStaff, userName: e.target.value })}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="userName"
      />
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Typography sx={{ marginRight: "10px" }}>Giới Tính:</Typography>
        <div>
          <label>
            <input
              type="radio"
              value="0"
              checked={newStaff.gender === "0"}
              onChange={() => handleGenderChange("0")}
            />
            Nam
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              value="1"
              checked={newStaff.gender === "1"}
              onChange={() => handleGenderChange("1")}
            />
            Nữ
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              value="2"
              checked={newStaff.gender === "2"}
              onChange={() => handleGenderChange("2")}
            />
            Other
          </label>
        </div>
      </Box>
      <TextField
        label="Email"
        type="email"
        value={newStaff.email}
        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="email"
      />
      <TextField
        label="Mật Khẩu"
        type="password"
        value={newStaff.password}
        onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="password"
      />

      <TextField
        label="Nhập Lại Mật Khẩu"
        type="password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="rePassword"
      />
      <TextField
        label="Địa Chỉ"
        type="text"
        value={newStaff.address}
        onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="address"
      />
      <TextField
        label="Số Điện Thoại"
        type="tel"
        value={newStaff.phoneNumber}
        onChange={(e) =>
          setNewStaff({ ...newStaff, phoneNumber: e.target.value })
        }
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="phoneNumber"
      />
      <TextField
        label=" Tháng, Ngày, Năm Sinh"
        type="date"
        value={newStaff.dateOfBirth}
        onChange={(e) =>
          setNewStaff({ ...newStaff, dateOfBirth: e.target.value })
        }
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="dateOfBirth"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <label htmlFor="avatarInput">
        <Button variant="outlined" component="span">
          Chọn Ảnh đại diện
        </Button>
        <input
          id="avatarInput"
          type="file"
          onChange={(e) => handleAvatarChange(e)}
          style={{ display: "none" }}
        />
      </label>
      {avatar && (
        <img
          src={avatar}
          alt="Avatar"
          style={{ width: "100px", height: "100px", marginBottom: "10px" }}
        />
      )}

      <TextField
        label="Số CMND"
        type="text"
        value={newStaff.identityNumber}
        onChange={(e) =>
          setNewStaff({ ...newStaff, identityNumber: e.target.value })
        }
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="identityNumber"
      />
      <TextField
        label="Ngày cấp CMND"
        type="date"
        value={newStaff.identityCardProvideDate}
        onChange={(e) =>
          setNewStaff({
            ...newStaff,
            identityCardProvideDate: e.target.value,
          })
        }
        margin="normal"
        required
        sx={{ width: "100%" }}
        id="identityCardProvideDate"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <label htmlFor="frontImageInput">
        <Button variant="outlined" component="span">
          Chọn Ảnh Mặt Trước CMND
        </Button>
        <input
          id="frontImageInput"
          type="file"
          onChange={(e) => handleFrontImageChange(e)}
          style={{ display: "none" }}
        />
      </label>
      {frontImage && (
        <img
          src={frontImage}
          alt="Front Image"
          style={{ width: "100px", height: "100px", marginBottom: "10px" }}
        />
      )}
      <label htmlFor="backImageInput">
        <Button variant="outlined" component="span">
          Chọn Ảnh Mặt Sau CMND
        </Button>
        <input
          id="backImageInput"
          type="file"
          onChange={(e) => handleBackImageChange(e)}
          style={{ display: "none" }}
        />
      </label>
      {backImage && (
        <img
          src={backImage}
          alt="Back Image"
          style={{ width: "100px", height: "100px", marginBottom: "10px" }}
        />
      )}
      {error && (
        <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
          {error}
        </Typography>
      )}

      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Thành Công</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tạo Tài Khoản thành công. Vui lòng chờ Admin hệ thống xét duyệt Tài
            Khoản của bạn.{" "}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Đã xảy ra lỗi khi tạo tài khoản, vui lòng kiểm tra lại thông tin cá
            nhân.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: "flex", justifycontent: "center" }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ margin: "0 50px 50px 0" }}
        >
          Tạo tài khoản
        </Button>
        <Button
          onClick={handleCancel}
          variant="contained"
          color="primary"
          sx={{ margin: "0 50px 50px 0" }}
        >
          Hủy
        </Button>
      </Box>
    </Box>
  );
};

export default StaffCreateNew;
