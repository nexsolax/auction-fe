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
    axiosInstance.get(url, { data: { id } });
  } catch (error) {
    console.log(error);
  }
  return axiosInstance.get(url);
}

export async function getNotificationById(id) {
  const url = `${BASE_URL}/Notification/by_id?staffId=${id}`;
  try {
    axiosInstance.get(url, { data: { id } });
  } catch (error) {
    console.log(error);
  }
  return axiosInstance.get(url);
}

export async function createStaff(newStaff) {
  const url = `${BASE_URL}/User`;
  const data = {
    staffName: newStaff.staffName,
    email: newStaff.email,
    password: newStaff.password,
    address: newStaff.address,
    phone: newStaff.phone,
    dateOfBirth: newStaff.dateOfBirth,
  };

  try {
    axiosInstance.post(url, data);
  } catch (error) {
    console.log(error);
  }
}

export async function updateStaff(upStaff) {
  const url = `${BASE_URL}/User`;
  const data = {
    staffId: upStaff.staffId,
    staffName: upStaff.staffName,
    address: upStaff.address,
    phone: upStaff.phone,
  };
  try {
    axiosInstance.put(url, data);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteStaff(id) {
  const url = `${BASE_URL}/User?id=${id}`;
  try {
    axiosInstance.delete(url, { data: { id } });
    console.log(`Deleted Staff: ${id}`);
  } catch (error) {
    console.log(error);
  }
}

export async function acceptUserWaiting(id) {
  const url = `${BASE_URL}/User/by_id?id=${id}/approve`;
  const data = { id };
  try {
    axiosInstance.put(url, { params: data });
    console.log(`Accept User: ${id}`);
  } catch (error) {
    console.log(error);
  }
}
export async function denyUserWaiting(id, reason) {
  const url = `${BASE_URL}/User`;
  const data = {
    id,
    reason,
  };
  try {
    axiosInstance.put(url, data);
    console.log(`Deny User: ${id}`);
  } catch (error) {
    console.log(error);
  }
}

export async function banUser(id, reason) {
  const url = `${BASE_URL}/User/by_id?id=${id}`;
  const data = {
    id
    
  };
  try {
    axiosInstance.put(url, data );
    console.log(`Ban User: ${id}`);
  } catch (error) {
    console.log(error);
  }
}

export async function unBanUser(id) {
  const url = `${BASE_URL}}/User/by_id?id=${id}`;
  const data = { id }
  try {
    axiosInstance.put(url, { params: data });
    console.log(`UnBan User: ${id}`);
  } catch (error) {
    console.log(error);
  }
}
