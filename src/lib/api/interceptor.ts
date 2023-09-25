import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/',
  withCredentials: true
});

let refresh = false;

axiosClient.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    console.log('error inter');
    if (error?.response?.status === 401 && !refresh) {
      console.log('error status is unauth');
      refresh = true;

      const response = await axiosClient.post('token/refresh', {}, { withCredentials: true });

      if (response.status === 200) {
        console.log;
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

        return axios(error.config);
      }
    }
    refresh = false;
    return error;
  }
);
