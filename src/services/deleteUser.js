import axios from 'axios';

export async function deleteUser(userId) {
  const url = `https://reasapi.azurewebsites.net/api/User/${userId}`;
  // return axios.delete(`https://bids-api-testing.azurewebsites.net/api/users/${userId}`, {user: {userId}});

  axios
    .delete(url, {
      data: { userId },
    })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
}
