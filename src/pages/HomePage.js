import { Box, Button, Container, Pagination, Typography } from '@mui/material';
import React from 'react'
import theme from '../theme';
import Appbar from '../components/appbar';
import Banner from '../components/banner';
import Promotions from '../components/promotions';
import Products from '../components/products';
import Footer from '../components/footer';
import AppDrawer from '../components/drawer';
import { UIProvider } from '../context/ui';
import SearchBox from '../components/search';
import StageProducts from '../components/products-instage/Stage-product';




function HomePage() {

    return (
        <Container
            maxWidth="xl"
            sx={{
                background: '#fff'
            }}
        >
            <UIProvider>
                <Appbar />
                <Banner />
                <Promotions />
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ p: 4, height: '10vh' }}>
                    <Typography variant="h3">Danh Sách Đấu Giá Tài Sản</Typography>
                </Box>
                <Products />
                <Footer />
                <AppDrawer />
                <SearchBox />
            </UIProvider>

        </Container>
    );
}

export default HomePage;