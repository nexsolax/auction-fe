import { Box, Button, Container, Pagination, Typography } from "@mui/material";
import React from "react";
import theme from "../theme";
import Appbar from "../components/appbar";
import Banner from "../components/banner";
import Promotions from "../components/promotions";
import Products from "../components/products";
import Footer from "../components/footer";
import AppDrawer from "../components/drawer";
import { UIProvider } from "../context/ui";
import SearchBox from "../components/search";
import StageProducts from "../components/products-instage/Stage-product";
import MyProductForm from "../components/myproduct";
import { Colors } from "../style/theme";

function MyProductPage() {
  const Image =
    "https://images.unsplash.com/photo-1644989787501-1397b3231a19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2839&q=80";
  return (
    <Container
      maxWidth="xl"
      sx={{
        background: "#fff",
      }}
    >
      <UIProvider>
        <Appbar />
        <div className="container">
          <div className="sm:flex-1 flex sm:items-center sm:justify-between">
            <div
              className="relative z-0 flex justify-between w-full -space-x-px rounded-md"
              aria-label="Pagination"
              onClick={() => window.history.back()}
            >
              <button
                type="button"
                className="relative inline-flex items-center px-2 py-2 text-sm 5xl:text-xl font-medium text-gray-900 bg-white border border-gray-300 rounded-md sm:rounded-none hover:bg-gray-50 sm:rounded-l-md "
                data-id="pagination-prev"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 20 20"
                  className="w-5 h-5"
                  aria-hidden="true"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>{" "}
                Previous Page
              </button>
            </div>
          </div>
        </div>
        <Box
          display={"flex"}
          flexDirection="column"
          sx={{
            p: 8,
            backgroundImage: `url(${Image})`,
            backgroundSize: "cover",
          }}
        >
          <Typography color={"white"} variant="h4">
            Danh Mục Tài Sản
          </Typography>
          <Typography color={"white"} variant="subtitle">
            Tài Sản Của Tôi
          </Typography>
        </Box>
        <MyProductForm />
        <Box display={"flex"} sx={{ p: 1 }}>
          <Typography variant="h5"> </Typography>
        </Box>
        <Footer />
        <AppDrawer />
        <SearchBox />
      </UIProvider>
    </Container>
  );
}

export default MyProductPage;
