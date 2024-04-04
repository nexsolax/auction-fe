import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  useMediaQuery,
  TextField,
  useTheme,
  Box,
  Pagination,
  Typography,
} from "@mui/material";
import axios from "axios";
import SingleProducts from "./SingleProducts";
import SingleProductDesktops from "./SingleProductDesktop";

export default function Products() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/Auction")
      .then((response) => {
        const data = response.data.data.pagingData.map((item) => {
          // Perform null/undefined checks before accessing nested properties
          const name = item.realEstates ? item.realEstates.name : "Unknown Name";
          const image = item.realEstates && item.realEstates.realEstateImages ? item.realEstates.realEstateImages[0].image : "Unknown Image";
          const startDate = item.startDate;
          const id = item.id;
          const status = item.status;
          const endDate = item.endDate;
          const startingPrice = item.startingPrice;
          return { name, id, status, image, startDate, endDate, startingPrice };
        });

        // Sort the auctions by status
        data.sort((a, b) => {
          const statusOrder = ['Approved', 'OnGoing'];
          const aIndex = statusOrder.indexOf(a.status);
          const bIndex = statusOrder.indexOf(b.status);

          // Assign a high value for statuses not found in statusOrder
          const aValue = aIndex !== -1 ? aIndex : statusOrder.length;
          const bValue = bIndex !== -1 ? bIndex : statusOrder.length;

          return aValue - bValue;
        });

        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      products.forEach((product) => {
        console.log(product.name);
        console.log(product.image);
      });
    }
  }, [products]);
  useEffect(() => {

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

  const productsPerPage = 9; // Number of products to display per page
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);


  const renderProducts = currentProducts.map((product) => (
    <Grid
      item
      key={product.id}
      xs={3}
      sm={4}
      md={4}
      display='flex'
      flexDirection={'column'}
      alignItems='center'
    >
      {matches ? (
        <SingleProducts
          id={product.id}
          productName={product.name}
          endDate={product.endDate}
          startDate={product.startDate}
          startingPrice={product.startingPrice}
          matches={matches}
        />
      ) : (
        <SingleProductDesktops
          products={products}
          id={product.id}
          status={product.status}
          productName={product.name}
          productImage={product.image}
          endDate={product.endDate}
          startDate={product.startDate}
          startingPrice={product.startingPrice}
          matches={matches}
        />
      )}
    </Grid>
  ));

  return (
    <Container>
      <Box sx={{ display: "flex", justifycontent: "flex-start" }}>
        <TextField
          label="Tìm Kiếm Sản Phẩm"
          variant="standard"
          size="medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "250px", marginLeft: "10px", marginBottom: "10px" }}
        />
      </Box>
      {filteredProducts.length === 0 ? (
        <Typography align="center">Không có tài sản</Typography>
      ) : (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          justifycontent="center"
          sx={{ margin: `20px 4px 10px 4px` }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {renderProducts}
        </Grid>
      )}
      {/* Pagination */}
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
}
