import axios from 'axios';
import config from './config'
// import { getTokenOnly } from './utils/cookieHelper';
// let token = getTokenOnly()

// if (token) {
//   // axios.defaults.headers.common = { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('fob_token')).token}` }
//   axios.defaults.headers.common.authorization = `Bearer ${token}`;
// }
/**
 * Method for calling APIs.
 * @param {String} method : Method using which the api is called(GET, POST, etc.)
 * @param {String} url : URL of the API
 * @param {Object} obj : Object/data to be sent as input.
 * @returns {Promise} Promise
 */
const call = (method, url, obj = {}) => {
  return new Promise((resolve, reject) => {
    //let token;
    let args = {
      method: method,
      url: config.baseUrl + url,
      data: obj
    }
    try {
      axios(args).then(response => {
        console.log("response console in called api:", response)
        if (response.data.success)
          resolve(response.data.message ? response.data.message : response.data.data ? response.data.data : response.data.disc);
        else
          response.data.message ? reject(response.data.message) : response.data.error ? reject(response.data.error) : reject(response.data.disc)
      }).catch(e => {
        console.log("Error in called api 1:==>", url, e)
        if (e.response && e.response.status === 401) {
          window.location = '/'
          localStorage.clear();
        } else {
          console.log("Error in called api 2:==>", url, e)
          reject(e);
        }
        reject(e);
      });

    } catch (error) {
      // console.log('Error in called api 3:==>', url, error);
      reject(error)
    }


  })
}

// const call = (method, url, obj) => {
//   return new Promise((resolve,reject)=>{
//   var request = require('request');
//   request[method.toLowerCase()](config.baseUrl+url, function (error, response, body) {
//     if (error) {
//       reject(error);
//     }
//     // console.log('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
//     resolve(body);
//   });
// })
// }

export default call;
