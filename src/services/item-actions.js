import axios from "axios";
import axiosInstance from "./axios-instance";

//const BASE_URL = 'https://reasapiv2.azurewebsites.net/api';
const BASE_URL = 'https://reasapiv2.azurewebsites.net/api/RealEstate';

export async function getAllItems() {
    const url = `${BASE_URL}`;
    return axiosInstance.get(url);
}

export async function getItemById(id) {
    const url = `${BASE_URL}?id=${id}`;
    return axiosInstance.get(url);
}

export async function deleteItems(id) {
    const url = `${BASE_URL}?id=${id}`;
    try {
        axiosInstance.delete(url, { data: { id } });
        console.log(`Deleted RealEstate: ${id}`);
    } catch (error) {
        console.log(error);
    }
}

