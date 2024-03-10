import axiosInstance from './axios-instance';

const BASE_URL = 'https://reasapiv2.azurewebsites.net/api';

export async function getAllPayment() {
  const url = `${BASE_URL}/Transaction`;
  return axiosInstance.get(url);
}

export async function getPaymentDetails(userId) {
  const url = `${BASE_URL}/Transaction`;
  return axiosInstance.get(url);
}
