import Axios from 'axios';

const AxiosClient = Axios.create({
  baseURL: 'http://192.168.0.232:8080/api-beautypalace',
});

const requestHandler = (request) => {
  request.headers['Accept'] = 'application/json';
  request.headers['Content-Type'] = 'application/json';
  /*const session = JSON.parse(localStorage.getItem('user')) || null;
  if (session?.isLogged)
    request.headers['Authorization'] = `Bearer ${session.token}`;
  return request;*/
};

const errorResponseHandler = (error) => Promise.reject(error);

const successResponseHandler = (response) => Promise.resolve(response.data);

AxiosClient.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => Promise.reject(error)
);

AxiosClient.interceptors.response.use(
  (response) => successResponseHandler(response),
  (error) => errorResponseHandler(error)
);

export default AxiosClient;

