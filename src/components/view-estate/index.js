import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  Box,
  Card,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Container,
  Modal,
  Chip,
} from "@mui/material";
import axios from "axios";
import { ProductImage } from "../../style/Products";
import { useNavigate } from "react-router-dom";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const ViewEstateForm = () => {
  const [RealEstates, setRealEstates] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [add, setAdd] = useState("");
  const [image, setImg] = useState("");
  const [status, setStatus] = useState("");
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
            const status = item.status;
            return { id, name, image, address, description, status };
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
  });

  const handleDelete = (itemId) => {
    Swal.fire({
      title: "Bạn có  chắc chắn muốn xoá tài sản?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Từ chối",
    }).then((result) => {
      if (result.isConfirmed) {
        const foundItem = RealEstates.find((item) => item.id === itemId);

        axios
          .delete(
            `https://reasapiv2.azurewebsites.net/api/RealEstate/${foundItem.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(() => {
            Swal.fire({
              title: "Xoá thành công!",
              text: "Tài sản đã được xoá ",
              icon: "success",
            });

            setIsDeleting(true);
          })
          .catch((error) => {
            return Swal.fire({
              position: "center",
              icon: "error",
              title: "Sản phẩm đang được đấu giá, không được xóa.",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  useEffect(() => {
    if (isDeleting) {
      window.location.reload();
    }
  }, [isDeleting]);
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  const handleItemClick = (item) => {
    setOpenModal(true);
    setItemData(item);
    setName(item.name);
    setImg(item.image);
    setDes(item.description);
    setAdd(item.address);
    setStatus(item.status);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    // bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Container>
      {/* <Button onClick={handleOpen}>Open Child Modal</Button> */}
      {/* Render modal if openModal state is true */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <Card sx={{ width: 700 }}>
            <CardMedia
              sx={{ height: 300 }}
              image={image}
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                {add}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {des}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {status}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Modal>

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
                    <TableCell>Status</TableCell>
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
                          {" "}
                          <Chip
                            label={item.status}
                            color={
                              item.status === "Pending" ? "warning" : "info"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {/* Action buttons */}
                          <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => handleItemClick(item)}
                          >
                            Xem chi tiết
                          </Button>

                          <Button
                            style={{ marginTop: 10 }}
                            variant="outlined"
                            size="medium"
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
        {/* Render modal if openModal state is true */}
      </div>
    </Container>
  );
};

export default ViewEstateForm;
