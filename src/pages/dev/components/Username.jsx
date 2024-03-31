import axios from "axios";
import { useEffect, useState } from "react";

export default function Username({ userId }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        axios
        .get(`https://reasapiv2.azurewebsites.net/api/User/${userId}`)
        .then((response) => {
            if (response.data) {
                setUser(response?.data?.data);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

  return <div>{user?.name}</div>;
}
