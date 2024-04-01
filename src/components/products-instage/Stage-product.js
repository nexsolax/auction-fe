import { Box, Container, Grid, Pagination, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
// import axios from 'axios';
import axios from "axios";

import StageSingleProducts from "./StageSingleProducts";
import StageSingleProductDesktop from "./StageSingleProductDesktop";


export default function StageProducts() {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productss, setProductss] = useState([]);
    const token = localStorage.getItem('token');
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {

        axios.get('https://reasapiv2.azurewebsites.net/api/Auction', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                const data = response.data.data.pagingData;
                // Map the fetched data to the products array
                console.log(data)
                setProductss(data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

    useEffect(() => {
        // Filter products based on searchQuery
        const filtered = productss.filter((product) =>
            product.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [searchQuery, productss]);

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
                <StageSingleProductDesktop product={product} matches={matches} />
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