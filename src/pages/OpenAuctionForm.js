import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Chip, Button } from "@mui/material";
import Swal from "sweetalert2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const OpenAuctionForm = () => {
  const [auctionId, setAuctionId] = useState("");
  const [dataList, setDataList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("loginUser");
  const jsonUser = JSON.parse(user);
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/Auction", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.pagingData)) {
          setDataList(response.data.data.pagingData);
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

  const handleSubmit = (auctionId) => {
    // event.preventDefault();
    setLoading(true);
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios
      .patch(
        `https://reasapiv2.azurewebsites.net/api/Auction/${auctionId}/open`,
        {},
        config
      )
      .then((response) => {
        window.location.reload();
        return Swal.fire({
          position: "center",
          icon: "success",
          title: "Thay đổi trạng thái thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: `${error.response.data.message}`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSubmit2 = (auctionId) => {
    // event.preventDefault();
    setLoading(true);
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios
      .patch(
        `https://reasapiv2.azurewebsites.net/api/Auction/${auctionId}/close`,
        {},
        config
      )
      .then((response) => {
        window.location.reload();
        return Swal.fire({
          position: "center",
          icon: "success",
          title: "Thay đổi trạng thái thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: `${error.response.data.message}`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Tên nhà đất</TableCell>
            <TableCell>Thời gian tạo</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="right">Hành động </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataList.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.realEstates.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {formatDate(row.dateCreate)}
              </TableCell>
              <TableCell component="th" scope="row">
                <Chip
                  label={
                    row.status === "Approved"
                      ? "Đã phê duyệt"
                      : row.status === "Completed"
                      ? "Hoàn thành"
                      : row.status === "OnGoing"
                      ? "Đang diễn ra"
                      : row.status === "Rejected"
                      ? "Đã từ chối"
                      : row.status === "Pending"
                      ? "Chưa phê duyệt"
                      : row.status === "Sold"
                      ? "Đã bán "
                      : row.status === "Failed"
                      ? "Đã thất bại "
                      : "..."
                  }
                  color={row.status === "Approved" ? "warning" : "info"}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  disabled={row.status === "Approved" ? false : true}
                  onClick={() => handleSubmit(row.id)}
                >
                  {" "}
                  {`${
                    row.status === "Approved"
                      ? "Xác nhận mở đấu giá"
                      : "Đấu giá đã mở"
                  }`}{" "}
                </Button>
                <Button
                  variant="contained"
                  disabled={row.status === "OnGoing" ? false : true}
                  onClick={() => handleSubmit2(row.id)}
                >
                  {" "}
                  {`${
                    row.status === "OnGoing"
                      ? "Đóng đấu giá"
                      : "Đấu giá đã kết thúc"
                  }`}{" "}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OpenAuctionForm;
