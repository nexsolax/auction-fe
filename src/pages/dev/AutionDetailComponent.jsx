import {
  Carousel,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { Button, Input } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import { moneyParser } from "../../utils/formatNumber";
import CountdownTimer from "./components/CountdownTimer";
import Username from "./components/Username";

const AutionDetailComponent = () => {
  const { autionId } = useParams();
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bidValue, setBidValue] = useState(0);
  const [highestBid, setHighestBid] = useState(0);

  const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60));
  const hoursRemaining = Math.floor(
    (timeRemaining % (24 * 60 * 60)) / (60 * 60)
  );
  const minutesRemaining = Math.floor((timeRemaining % (60 * 60)) / 60);
  const secondsRemaining = Math.floor(timeRemaining % 60);

  const [product, setProduct] = useState([]);

  const fetchProduct = () => {
    axios
      .get(`https://reasapiv2.azurewebsites.net/api/Auction/${autionId}`)
      .then((response) => {
        //filter product?.userBids dateCreate newest
        response?.data?.data?.userBids.sort((a, b) => {
          return new Date(b.dateCreate) - new Date(a.dateCreate);
        });
        setProduct(response?.data?.data);
        console.log(response?.data?.data);
        setHighestBid(
          response?.data?.data?.userBids[0]?.amount ||
          response?.data?.data?.startingPrice
        );

        if (response?.data?.data?.status === "Completed") {
          setTimeRemaining(0 / 1000);
        } else {
          // setTimeRemaining
          const startDate = new Date(response?.data?.data?.startDate);
          const endDate = new Date(response?.data?.data?.endDate);
          const currentDate = new Date();
          const timeRemaining = endDate - currentDate;
          // check if timeRemaining < 0 then set isPlaying to false

          if (startDate > currentDate) {
            setTimeRemaining((startDate - currentDate) / 1000);
          } else if (endDate > currentDate) {
            setTimeRemaining(timeRemaining / 1000);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const navigate = useNavigate();
  // write use effect call per 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProduct();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRegister = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to /login if the user is not logged in
      // window.location.href = "/login";
      toast.error("Bạn cần phải đăng nhập");
      return;
    }

    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(
        `https://reasapiv2.azurewebsites.net/api/Auction/${autionId}/register`,
        {},
        config
      )
      .then((response) => {
        console.log(response?.data?.data)

        window.location.href = response?.data?.data || "/";
        return;
      })
      .catch((error) => {
        console.log(error)
        console.log(error?.response?.data?.message || error?.message);
        toast.error("Đăng ký thất bại: " + error?.response?.data?.message || error?.message || "");
      })
      .finally(() => {
        fetchProduct();
      });
  };

  const handleBid = () => {
    const amount = Number(bidValue);
    if (!amount) return;
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      // Redirect to /login if the user is not logged in
      // window.location.href = "/login";
      toast.error("Bạn cần phải đăng nhập");
      return;
    }
  
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    axios
      .post(
        `https://reasapiv2.azurewebsites.net/api/Auction/${autionId}/place-bid`,
        {
          amount: amount,
        },
        config
      )
      .then((response) => {
        console.log(response.data.data);
        setBidModalOpen(false);
        toast.success("Đặt giá thành công");
        setTimeout(() => {
          fetchProduct();
        }, 1000);
      })
      .catch((error) => {
        console.log("Error fetching data:", error.response?.data);
        toast.error("Đặt giá thất bại: " + error?.response?.data?.message || "");
      });
  };

  const handleBidChange = (e) => {
    const value = e.target.value;
    setBidValue(value);
  };

  return (
    <div>
      <div className="container mt-8">
        <h1 className="text-3xl font-bold mb-12 border-b-2 pb-4">
          {product?.realEstates?.name}
        </h1>

        <div className="grid grid-cols-7 gap-x-6">
          <div className="col-span-3">
            <Carousel>
              {product?.realEstates?.realEstateImages?.map((image) => (
                <img
                  key={image.id}
                  src={image.image}
                  alt="Real Estate"
                  className="h-full w-full object-cover rounded-md"
                />
              ))}
            </Carousel>
          </div>
          <div className="col-span-4">
            <div className="">
              <h2 className="text-xl font-bold mb-2">Thông tin:</h2>
              <div className="text-md mb-4">
                <p>
                  <b>Tên:</b> {product?.realEstates?.name}
                </p>
                <p>
                  <b>Địa chỉ:</b> {product?.realEstates?.address}
                </p>
                <p>
                  <b>Miêu tả:</b> {product?.realEstates?.description}
                </p>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">
                  Giá cao nhất hiện tại:
                </h2>
                <h2 className="text-xl font-black">
                  {moneyParser(highestBid)} đ
                </h2>
              </div>

              {product?.status === "OnGoing" && (
                <div className="mb-4 flex items-center">
                  {product?.status == "Pending" ? (
                    <></>
                  ) : (
                    <>
                      <Input
                        type="number"
                        value={bidValue}
                        onChange={handleBidChange}
                        inputProps={{
                          min: bidValue,
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBid}
                      >
                        Đấu giá
                      </Button>
                    </>
                  )}
                </div>
              )}

              {product?.status === "Approved" && (
                <Button
                  onClick={handleRegister}
                  variant="contained"
                  className="mb-4"
                >
                  Đăng ký
                </Button>
              )}

              <div className="mb-4">
                {product?.status === "OnGoing" ? (
                  <h3 className="text-xl font-bold mb-4">
                    Thời gian đếm ngược đến khi đấu giá kết thúc:
                  </h3>
                ) : (
                  <>
                    {product?.status === "Approved" ? (
                      <h3 className="text-xl font-bold mb-4">
                        Thời gian đếm ngược đến khi đấu giá bắt đầu:
                      </h3>
                    ) : (
                      <h3 className="text-xl font-bold mb-4">
                        Thời gian đếm ngược đến khi đấu giá kết thúc:
                      </h3>
                    )}
                  </>
                )}
                <CountdownTimer
                  {...{
                    daysRemaining,
                    hoursRemaining,
                    minutesRemaining,
                    secondsRemaining,
                  }}
                />
              </div>
              {product?.status === "Completed" ? (
                <div className="bg-green-200 text-green-500 flex items-center justify-center rounded-md py-2 px-4">
                  <p className="text-lg font-bold">Hoàn thành</p>
                </div>
              ) : product?.status === "OnGoing" ? (
                <div className="bg-blue-200 text-blue-500 flex items-center justify-center rounded-md py-2 px-4">
                  <p className="text-lg font-bold">Đang diễn ra</p>
                </div>
              ) : product?.status === "Approved" ? (
                <div className="bg-blue-200 text-blue-500 flex items-center justify-center rounded-md py-2 px-4">
                  <p className="text-lg font-bold">Đang mở đăng ký</p>
                </div>
              ) : product?.status === "Pending" ? (
                <div className="bg-gray-200 text-gray-500 flex items-center justify-center rounded-md py-2 px-4">
                  <p className="text-lg font-bold">Chờ duyệt</p>
                </div>
              ) : (
                <div className="bg-gray-200 text-gray-500 flex items-center justify-center rounded-md py-2 px-4">
                  <p className="text-lg font-bold">{product?.status}</p>
                </div>
              )}
            </div>

            {product?.status === "Completed" && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">Tổng kết đấu giá</h2>
                <p>
                  <b>Giá chốt:</b>{" "}
                  {product?.winnerId && moneyParser(highestBid) + " đ"}
                </p>
                <p className="flex gap-2">
                  <b>Người thắng: </b>{" "}
                  {product?.winnerId && <Username userId={product?.winnerId} />}
                </p>
              </div>
            )}
          </div>
        </div>

        <section className="mt-4">
          <Tabs id="custom-animation" value="registration details">
            <TabsHeader>
              <Tab value={"registration details"}>Thông tin đăng ký</Tab>
              <Tab value={"auction details"}>Thông tin đấu giá</Tab>
              <Tab value={"user"}>Lịch sử đặt giá</Tab>
            </TabsHeader>
            <TabsBody
              animate={{
                initial: { y: 250 },
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
            >
              <TabPanel
                key={"registration details"}
                value={"registration details"}
              >
                <div>
                  <h2 className="text-xl font-bold mb-2">Thông tin đăng ký</h2>
                  <p>
                    Ngày bắt đầu:{" "}
                    {new Date(product?.registrationStartDate)?.toLocaleString()}
                  </p>
                  <p>
                    Ngày kết thúc:{" "}
                    {new Date(product?.registrationEndDate)?.toLocaleString()}
                  </p>
                  <p>
                    Phí đăng ký: {moneyParser(product?.registrationFee) + " đ"}
                  </p>
                </div>
              </TabPanel>
              <TabPanel key={"auction details"} value={"auction details"}>
                <div>
                  <h2 className="text-xl font-bold mb-2">Chi tiết đấu giá</h2>
                  <p>
                    Giá bắt đầu: {moneyParser(product?.startingPrice) + " đ"}
                  </p>
                  <p>
                    Tăng giá mỗi lần:{" "}
                    {moneyParser(product?.bidIncrement) + " đ"}

                  </p>

                  <p>
                    Bước giá tối đa:{" "}
                    {product?.maxBidIncrement
                      ? moneyParser(product?.maxBidIncrement) + " đ"
                      : "Không giới hạn"}
                  </p>
                  <p>Giá đặt cọc: {moneyParser(product?.deposit) + " đ"}</p>
                  <p>
                    Ngày bắt đầu :{" "}
                    {new Date(product?.startDate).toLocaleString()}
                  </p>
                  <p>
                    Ngày kết thúc: {new Date(product?.endDate).toLocaleString()}
                  </p>
                  <p>
                    Thời gian duyệt sản phẩm:{" "}
                    {new Date(product?.approveTime).toLocaleString()}
                  </p>
                  <p>
                    Tình trạng:{" "}
                    {product?.status == "Pending"
                      ? "Chờ duyệt"
                      : product?.status == "Approved"
                        ? "Đang mở đăng ký"
                        : product?.status == "OnGoing"
                          ? "Đang diễn ra"
                          : product?.status == "Completed"
                            ? "Đã kết thúc"
                            : ""}
                  </p>
                </div>
              </TabPanel>
              <TabPanel key={"user"} value={"user"}>
                <div>
                  <div className="overflow-x-auto">
                    {product?.userBids?.length === 0 ? (
                      <div className="h-40 w-full flex justify-center items-center">
                        <p>Chưa có lịch sử đặt giá</p>
                      </div>
                    ) : (
                      <table className="table-auto w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2">Người đấu giá</th>
                            <th className="px-4 py-2">Ngày tạo</th>
                            <th className="px-4 py-2">Số tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product?.userBids?.map((bid) => (
                            <tr key={bid?.id}>
                              <td className="border px-4 py-2">
                                {bid?.id && <Username userId={bid?.userId} />}
                              </td>
                              <td className="border px-4 py-2">
                                {new Date(bid?.dateCreate).toLocaleString()}
                              </td>
                              <td className="border px-4 py-2">
                                {moneyParser(bid?.amount) + " đ"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </section>
      </div>
      <ToastContainer />

      {/* old code */}
    </div>
  );
};

export default AutionDetailComponent;
