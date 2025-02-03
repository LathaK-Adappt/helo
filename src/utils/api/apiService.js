import axios from 'axios';

class ApiService {
  fetchApi = (url, timeout) => {
    //console.log('url, timeout', url, timeout);
    return new Promise((resolve, reject) => {
      let timestamp = new Date();
      axios
        .get(url, {
          headers: {
            'Cache-Control': 'no-cache',
          },
          timeout: timeout,
        })
        .then((response) => {
          //console.log('response data', response.data);
          return resolve(response.data);
        })
        .catch((error) => {
          // console.log('catch error', error);
          return reject(error);
        });
    });
  };
}
export default new ApiService();
