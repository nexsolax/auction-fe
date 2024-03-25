import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box,
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Pagination,
  Container,
  useMediaQuery,

} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { ProductImage } from "../../style/Products";
import { useNavigate } from "react-router-dom";


const ViewEstateForm = () => {
  const [RealEstates, setRealEstates] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  

  useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/RealEstate?pageSize=100", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.pagingData)) {
          const data = response.data.data.pagingData.map((item) => {
            // Perform null/undefined checks before accessing nested properties
            const id = item.id;
            const name = item.name;
            const image = item.realEstateImages[0].image;
            const address = item.address;
            const description = item.description;
            return { id, name, image, address, description };
          });
          setRealEstates(data);
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

  const handleViewDetail = (itemId) => {
    // Logic to show view detail for the item with ID: itemId
    // This could involve opening a modal or redirecting to a separate detail page.
  };
  const handleDelete = (itemId) => {
    const foundItem = RealEstates.find((item) => item.id === itemId);
    console.log(foundItem);
    // Confirmation dialog (optional)
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios
        .delete(
          `https://reasapiv2.azurewebsites.net/api/RealEstate/${foundItem.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          // Handle successful deletion (e.g., remove item from UI, show success message)
          console.log("Item deleted successfully!");
          // You might want to refetch data to update the table
          setIsDeleting(true);
        })
        .catch((error) => {

          console.error("Error deleting item:", error);
          window.alert("Sản phẩm đang được đấu giá, không được xóa.");
        });
    }
  };

  useEffect(() => {
    if (isDeleting) {
      window.location.reload();
    }
  }, [isDeleting]);
  
  return (
    <Container>
      <div>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/additem");
                }}
              >
                Thêm bất động sản
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(RealEstates) &&
                    RealEstates.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <ProductImage src={item.image} />
                        </TableCell>

                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.address}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          {/* Action buttons */}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetail(item.id)}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            value={item.id}
                            // onChange={(event) => setId(event.target.value)}
                            onClick={(event) =>
                              handleDelete(event.target.value)
                            }
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        )}
      </div>
    </Container>
  );
};

export default ViewEstateForm;
