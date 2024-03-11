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

const AddProductForm = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("loginUser");
  const jsonUser = JSON.parse(user);
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/Category", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

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
    image.forEach((img) => {
      formData.append("image", img);
    });

    axios
      .post("https://reasapiv2.azurewebsites.net/api/RealEstate", formData, {
        headers: { Authorization: `Bearer ${token}` },
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
    setItemName("");
    setAddress("");
    setDescription("");
    setCategoryId("");
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
        label="Name"
        value={itemName}
        onChange={(event) => setItemName(event.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
        rows={4}
      />
      <FormControl fullWidth required margin="normal">
        <InputLabel>Category</InputLabel>
        <Select value={categoryId} onChange={handleCategoryChange}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </Select>
      </FormControl>
      <input
        type="file"
        onChange={(event) => setImage([...event.target.files])}
        multiple
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
