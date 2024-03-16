import axios from 'axios';
import axiosInstance from './axios-instance';

const BASE_URL = 'https://reasapiv2.azurewebsites.net/api';

export async function getAllStaff() {
  const url = `https://reasapiv2.azurewebsites.net/api/User`;
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

// export async function getNotificationById(id) {
//   const url = `${BASE_URL}/Notification?id=${id}`;
//   try {
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     console.log('Error fetching notification by id:', error);
//     throw error; // Re-throw the error to handle it elsewhere
//   }
// }
export async function createStaff(staffData, identificationData, imageData) {
  const url = `${BASE_URL}/User`;
  try {
    // Create staff
    const response = await axiosInstance.post(url, staffData);

    // If identificationData exists, upload identification information
    if (identificationData) {
      const { id } = response.data; // Extract staff id from response
      const identificationUploadResponse = await uploadIdentificationInformation(id, identificationData);
      if (identificationUploadResponse.status !== 200) {
        throw new Error('Failed to upload identification information');
      }
    }

    // If imageData exists, upload image profile
    if (imageData) {
      const { id } = response.data; // Extract staff id from response
      const imageUploadResponse = await uploadImageProfile(id, imageData);
      if (imageUploadResponse.status !== 200) {
        throw new Error('Failed to upload image profile');
      }
    }

    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateStaff(staffData, identificationData, imageData) {
  const url = `${BASE_URL}/User`;
  try {
    // Update staff
    const response = await axiosInstance.put(url, staffData);

    // If identificationData exists, upload identification information
    if (identificationData) {
      const { id } = staffData; // Extract staff id from staffData
      const identificationUploadResponse = await uploadIdentificationInformation(id, identificationData);
      if (identificationUploadResponse.status !== 200) {
        throw new Error('Failed to upload identification information');
      }
    }

    // If imageData exists, upload image profile
    if (imageData) {
      const { id } = staffData; // Extract staff id from staffData
      const imageUploadResponse = await uploadImageProfile(id, imageData);
      if (imageUploadResponse.status !== 200) {
        throw new Error('Failed to upload image profile');
      }
    }

    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function deleteStaff(id) {
  const url = `${BASE_URL}/User?id=${id}`;
  try {
    return axiosInstance.delete(url);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function uploadIdentificationInformation(staffId, identificationData) {
  const url = `${BASE_URL}/User/upload-identification-information`;
  try {
    // Convert identificationData to the required format (string($binary))
    const binaryData = convertToBinaryString(identificationData);
    // Make the API call with the converted data
    return axiosInstance.post(url, binaryData, {
      params: { id: staffId }, // Pass staffId as a query parameter
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function uploadImageProfile(staffId, imageData) {
  const url = `${BASE_URL}/User/upload-image-profile`;
  try {
    // Convert imageData to the required format (string($binary))
    const binaryData = convertToBinaryString(imageData);
    // Make the API call with the converted data
    return axiosInstance.post(url, binaryData, {
      params: { id: staffId }, // Pass staffId as a query parameter
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Function to convert binary data to string($binary) format
function convertToBinaryString(data) {
  // Convert the binary data to a string
  const binaryString = btoa(String.fromCharCode.apply(null, data));
  // Prefix the string with 'data:image/jpeg;base64,' (change based on the image type)
  return `data:image/jpeg;base64,${binaryString}`;
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
  const url = `${BASE_URL}/User?id=${id}`;
  try {
    return axiosInstance.put(url, { reason });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function banUser(id) {
  const url = `${BASE_URL}/User?id=${id}`;
  try {
    return axiosInstance.put(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function unBanUser(id) {
  const url = `${BASE_URL}/User?id=${id}`;
  try {
    return axiosInstance.put(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
