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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [approveTime, setApproveTime] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const [approveByUserId, setApproveByUserId] = useState("");
  const [realEstateImages, setRealEstateImages] = useState([]);
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
  const navigate = useNavigate();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/RealEstate", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.pagingData)) {
          const data = response.data.data.pagingData.map((item) => {
            // Perform null/undefined checks before accessing nested properties
            const name = item.name;
            const image = item.realEstateImages[0].image;
            const address = item.address;
            const description = item.description;
            // products.forEach((product) => {
            //   console.log(product.name);
            //   console.log(product.image);
            // });
            return { name, image, address, description };
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
  useEffect(() => {
    // Filter products based on searchQuery
    if (products.length > 0) {
      const filtered = products.filter(
        (product) =>
          product.name &&
          searchQuery &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(filtered);
      setFilteredProducts(products);

    }


    setCurrentPage(1);
  }, [searchQuery, products]);

  const productsPerPage = 3; // Number of products to display per page
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
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
              {Array.isArray(RealEstates) && RealEstates.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <ProductImage src={item.image} />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{/* Add action buttons/links here */}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        
      )}
    </div>
    <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{
          marginTop: "20px",
          display: "flex",
          justifycontent: "center",
          marginBottom: "10px",
        }}
      />
    </Container>
  );
};

export default ViewEstateForm;
