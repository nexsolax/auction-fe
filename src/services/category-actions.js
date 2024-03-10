import axios from "axios";
import axiosInstance from "./axios-instance";

const BASE_URL = 'https://reasapiv2.azurewebsites.net/api';

export async function getAllCategory() {
    const url = `${BASE_URL}/Category`;
    return axiosInstance.get(url);
}

export async function createCategory(newCategory) {
    const url = `${BASE_URL}/Category`;
    const data = {
        categoryName: newCategory.categoryName,
    }

    try{
        axiosInstance.post(url, data);
    }
    catch(error){
        console.log(error);
    }
}

export async function createDescription(categoryId, descriptionName) {
    const url = `${BASE_URL}/Category`;
    const data = {
        categoryId,
        detail: descriptionName
    }

    try{
        axiosInstance.post(url, data);
    }
    catch(error){
        console.log(error);
    }
}

export async function deleteDescription(id) {
    const url = `${BASE_URL}/Category?id=${id}`;
    try {
        axiosInstance.delete(url, { data: { id } });
        console.log(`Deleted description: ${id}`);
    } catch (error) {
        console.log('Khong delete duoc', error);
    }
}

export async function updateCategory(upCategory) {
    const url = `${BASE_URL}/Category`;
    const data = {
        categoryId: upCategory.categoryId,
        categoryName: upCategory.categoryName,
        status: Boolean(upCategory.status),
    }
    try {
        axiosInstance.put(url, data);
    } catch (error) {
        console.log(error);
    }
}

export async function deleteCategory(id) {
    const url = `${BASE_URL}/Category?id=${id}`;
    try {
        axiosInstance.delete(url, { data: { id } });
        console.log(`Deleted Category: ${id}`);
    } catch (error) {
        console.log('Khong delete duoc', error);
    }
}