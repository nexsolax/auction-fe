import axios from 'axios';
import axiosInstance from './axios-instance';

const BASE_URL = 'https://reasapiv2.azurewebsites.net/api';

export async function getAllBookingItem() {
  const url = `${BASE_URL}/RealEstate`;
  return axiosInstance.get(url);
}

export async function getBookingItemById(id) {
  const url = `${BASE_URL}/RealEstate/by_id?id=${id}`;
  try {
    axiosInstance.get(url, { data: { id } });
  } catch (error) {
    console.log(error);
  }
  return axiosInstance.get(url);
}

export async function getBookingItemWaiting(id) {
  const url = `${BASE_URL}/RealEstate/by_id?id=${id}`;

  try {
    const response = await axiosInstance.get(url, { params: { isApprove: false } });
    return response.data; // Assuming you want to return the response data
  } catch (error) {
    console.error('Error fetching booking item:', error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}

export async function getBookingItemNoSesssion(id) {
  const url = `${BASE_URL}//RealEstate/by_id?id=${id}`;

  try {
    await axiosInstance.get(url);
  } catch (error) {
    console.log(error);
  }
}

export async function acceptBookingItemWaiting(id) {
  const url = `${BASE_URL}/RealEstate/by_id/${id}`; // Assuming id is used to specify the resource ID
  try {
    // Send a PUT request to update the isApprove status
    await axiosInstance.put(url, { isApprove: true }); // Assuming isApprove is the key to update the status
    console.log(`Accepted BookingItem: ${id}`);
  } catch (error) {
    console.error('Error accepting booking item:', error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}

export function getStatusInfo(status) {
  switch (status) {
    case 'Waiting':
      return { text: 'Đang chờ duyệt', color: '#FA8D24' }; // Red color
    case 'Accepted':
      return { text: 'Đã chấp nhận', color: '#00FF00' }; // Green color
    default:
      return { text: 'Unknown', color: '#000000' }; // Black color for unknown status
  }
}

export const getStatusLabel = (status) => {
  switch (status) {
    case 'Waiting':
      return 'Đang chờ duyệt';
    case 'Accepted':
      return 'Đã chấp nhận';
    case 'Denied':
      return 'Từ chối';
    case 'Unactive':
      return 'Không hoạt động';
    case 'NotCreateSessionYet':
      return 'Chưa có Phiên';
    case 'SessionWaiting':
      return 'Chờ duyệt';
    default:
      return '';
  }
};
