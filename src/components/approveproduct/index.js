import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useTheme } from "@mui/material/styles";
import { Button, Chip } from "@mui/material";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const ApproveProductForm = () => {
  // const [realEstateId, setRealEstateId] = useState("");
  const [RealEstates, setRealEstates] = useState("");
  const [dataList, setDataList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("loginUser");
  const jsonUser = JSON.parse(user);
  const theme = useTheme();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/RealEstate", {
        headers: { Authorization: `Bearer ${token}` },
        params: { PageSize: 100, PageIndex: 1 },
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
  function getReload() {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/RealEstate", {
        headers: { Authorization: `Bearer ${token}` },
        params: { PageSize: 100, PageIndex: 1 },
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
  }

  // const handleEstateChange = (event) => {
  //   setRealEstateId(event.target.value);
  // };

  const handleSubmit = (realEstateId) => {
    // event.preventDefault();
    setLoading(true);
    const formData = {
      isApproved: true,
    };
    axios({
      method: "put",
      url: `https://reasapiv2.azurewebsites.net/api/RealEstate/${realEstateId}/approve`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    })
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
        // return MySwal.fire(error.response.data.message)
        // setError(error.response.data.message || "An error occurred");
        // setErrorDialogOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSubmit2 = (realEstateId) => {
    // event.preventDefault();
    setLoading(true);
    const formData = {
      isApproved: false,
    };
    axios({
      method: "put",
      url: `https://reasapiv2.azurewebsites.net/api/RealEstate/${realEstateId}/approve`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    })
      .then((response) => {
        window.location.reload();
        return Swal.fire({
          position: "center",
          icon: "success",
          title: "Từ chối thành công",
          showConfirmButton: true,
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
        // return MySwal.fire(error.response.data.message)
        // setError(error.response.data.message || "An error occurred");
        // setErrorDialogOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  console.log(`real data:${dataList.length} `);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Tên nhà đất</TableCell>
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
                {row.name}
              </TableCell>
              <TableCell component="th" scope="row">
                <Chip
                  label={row.status}
                  color={row.status === "Pending" ? "warning" : "info"}
                />
              </TableCell>
              <TableCell align="right">
              <Button
                  variant="contained"
                  disabled={row.status === "Pending" ? false : true}
                  onClick={() => handleSubmit(row.id)}
                >
                  {" "}
                  {`${
                    row.status === "Pending" ? "Xác nhận" : "Đã xác nhận"
                  }`}{" "}
                </Button>
                <Button
                  variant="contained"
                  disabled={row.status === "Pending" ? false : true}
                  onClick={() => handleSubmit2(row.id)}
                >
                  {" "}
                  {`${
                    row.status === "Pending" ? "Huỷ yêu cầu" : "Đã hủy yêu cầu"
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

export default ApproveProductForm;
