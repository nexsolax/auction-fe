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

const AddProductForm = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [address, setAddress] = useState("");
  // const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("loginUser");
  const jsonUser = JSON.parse(user);
  const theme = useTheme();
  const decode = jwtDecode(token);
  const [image, setImage ] = useState("");
  const [pricing, setPricing] = useState("");
  const [acreage, setAcreage] = useState("");
  const [linkAttachment, setLinkAttachment] = useState("");

  useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/Category", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.pagingData)) {
          // Assuming the data structure contains category objects with 'id' and 'name'
          const categoriesData = response.data.data.pagingData.reduce((acc, category) => {
            if (category.id && category.name) {
              acc[category.id] = category.name;
            } else {
              console.error("Invalid category data:", category);
            }
            return acc;
          }, {});
          setCategories(categoriesData);
          console.log(categories);
        } else {
          console.error("Invalid response data format:", response.data);
          setError("Invalid response data format. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Error fetching categories. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("address", address);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("pricing", pricing);
    formData.append("acreage",acreage)
    formData.append("linkAttachment", linkAttachment);
    // image.forEach((img) => {
    //   formData.append("image", img);


    // })
    formData.append("Images", image);

    // axios({
    //   method: "post",
    //   url: "myurl",
    //   data: bodyFormData,
    //   headers: { "Content-Type": "multipart/form-data" },
    // })

    axios
    ({
      method: "post",
      url: "https://reasapiv2.azurewebsites.net/api/RealEstate",
      data: formData,
      headers: { Authorization: `Bearer ${token}`, 'content-type': 'multipart/form-data' },
    })
      // .post("https://reasapiv2.azurewebsites.net/api/RealEstate", formData, {
      //   headers: { Authorization: `Bearer ${token}`, 'content-type': 'multipart/form-data' },
    
      
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
    setItemName("");
    setAddress("");
    setDescription("");
    setCategoryId("");
    setPricing("");
    setAcreage("");
    setLinkAttachment("");
    setImage([]);
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
        label="Tên tài sản"
        value={itemName}
        onChange={(event) => setItemName(event.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Địa chỉ"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Mô tả"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        label="Định giá tài sản"
        value={pricing}
        onChange={(event) => setPricing(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
        rows={2}
      />
      <TextField
        label="Diện tích"
        value={acreage}
        onChange={(event) => setAcreage(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
        rows={2}
      />
       <TextField
        label="Đường dẫn tài liệu đính kèm"
        value={linkAttachment}
        onChange={(event) => setLinkAttachment(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
        rows={2}
      />
      <FormControl fullWidth required margin="normal">
        <InputLabel>Category</InputLabel>
        <Select value={categoryId} onChange={handleCategoryChange}>
          {Object.keys(categories).length > 0 ? (
            Object.keys(categories).map((categoryId) => (
              <MenuItem key={categoryId} value={categoryId}>
                {categories[categoryId]} {/* Displaying category name */}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </Select>
      </FormControl>

      <input
        // type="file"
        // onChange={(event) => setImage([...event.target.files[0]])}
        multiple
        accept="image/*"
        type="file" onChange= {(e)=> setImage(e.target.files[0])}
      />
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
          "Add Product"
        )}
      </Button>
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>
          <TaskAltIcon />
        </DialogTitle>
        <DialogTitle variant="h3" align="center">
          Product Added Successfully
        </DialogTitle>
        <DialogContent>
          <Typography align="center" variant="subtitle2">
            Your product has been successfully added.
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

export default AddProductForm;
