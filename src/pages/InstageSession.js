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

function HomePage() {
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
        <Box display={"flex"} justifycontent={"center"} sx={{ p: 4 }}>
          <Typography background variant="h4">
            Tài Sản Đang Được đấu giá
          </Typography>
        </Box>
        <StageProducts />
        <Footer />
        <AppDrawer />
        <SearchBox />
      </UIProvider>
    </Container>
  );
}

export default HomePage;
