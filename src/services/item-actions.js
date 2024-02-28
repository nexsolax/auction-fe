import axios from "axios";
import axiosInstance from "./axios-instance";

//const BASE_URL = 'https://bids-online.azurewebsites.net/api';
const BASE_URL = 'https://reasapi.azurewebsites.net/api/auction';

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
        console.log(`Deleted auction: ${id}`);
    } catch (error) {
        console.log(error);
    }
}

// export async function createSession(session) {
//     const url = `${BASE_URL}/sessions`;
//     const data = {
//         itemId: session.itemId,
//         sessionName: session.sessionName,
//         beginTime: session.beginTime,
//         auctionTime: session.auctionTime,
//         endTime: session.endTime,
//     }
//     try {
//         axiosInstance.post(url, data);
//     } catch (error) {
//         console.log(error);
//     }
// }