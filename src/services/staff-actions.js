import axios from 'axios';
import axiosInstance from './axios-instance';

const BASE_URL = 'https://reasapi.azurewebsites.net/api';

export async function getAllStaff() {
  const url = `https://reasapi.azurewebsites.net/api/User`;
  return axiosInstance.get(url);
}

export async function getStaffById(id) {
  const url = `${BASE_URL}/User/by_id?id=${id}`;
  try {
    return axiosInstance.get(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getNotificationById(id) {
  const url = `${BASE_URL}/Notification/by_id?id=${id}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.log('Error fetching notification by id:', error);
    throw error; // Re-throw the error to handle it elsewhere
  }
}

export async function createStaff(newStaff) {
  const url = `${BASE_URL}/User`;
  try {
    return axiosInstance.post(url, newStaff);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateStaff(upStaff) {
  const url = `${BASE_URL}/User`;
  try {
    return axiosInstance.put(url, upStaff);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteStaff(id) {
  const url = `${BASE_URL}/User?id=${id}`;
  try {
    return axiosInstance.delete(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function acceptUserWaiting(id) {
  const url = `${BASE_URL}/User/by_id/${id}/approve`;
  try {
    return axiosInstance.put(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function denyUserWaiting(id, reason) {
  const url = `${BASE_URL}/User/by_id/${id}`;
  try {
    return axiosInstance.put(url, { reason });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function banUser(id) {
  const url = `${BASE_URL}/User/by_id/${id}`;
  try {
    return axiosInstance.put(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function unBanUser(id) {
  const url = `${BASE_URL}/User/by_id/${id}`;
  try {
    return axiosInstance.put(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
