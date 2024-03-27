import { Box, Container, Grid, Pagination, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
// import axios from 'axios';
import axios from "axios";

import StageSingleProducts from "./StageSingleProducts";
import AppStagePagination from "../pagination/stage-pagination";
import StageSingleProductDesktop from "./StageSingleProductDesktop";






export default function StageProducts() {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token');
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {

        axios.get('https://reasapiv2.azurewebsites.net/api/Auction', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                const data = response.data.data.pagingData.map((item) => {
                    // Perform null/undefined checks before accessing nested properties
                    const name = item.realEstates ? item.realEstates.name : "Unknown Name";
                    const image = item.realEstates && item.realEstates.realEstateImages ? item.realEstates.realEstateImages[0].image : "Unknown Image";
                    const startDate = item.startDate;
                    const id = item.id;
                    const status = item.status;
                    const endDate = item.endDate;
                    // products.forEach((product) => {
                    //   console.log(product.name);
                    //   console.log(product.image);
                    // });
                    return { name, id, status, image, startDate, endDate };
                  });
                  setProducts(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

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
          // setSearchQuery(filtered);
        }
    
        // Reset currentPage to 1 when searchQuery changes
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





    const renderProducts = currentProducts.map((product) => (
        <Grid
            item
            key={product.sessionId}
            xs={3}
            sm={4}
            md={4}
            display="flex"
            flexDirection={"column"}
            alignItems="center"
        >
            {matches ? (
                <StageSingleProducts product={product} matches={matches} />
            ) : (
                <StageSingleProductDesktop
                id={product.id}
                status={product.status}
                productName={product.name}
                productImage={product.image}
                endDate={product.endDate}
                startDate={product.startDate}
                //   startingPrice={product.startingPrice}
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
            <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ marginTop: "20px", display: "flex", justifycontent: "center", marginBottom: "10px" }}
            />
        </Container>
    );
}