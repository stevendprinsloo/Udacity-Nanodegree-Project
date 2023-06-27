import axios from "axios";

import { HttpStatus } from "@/const";

import { store } from "@/store";

console.log("ENV PROCESS 02========================", process.env);

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

axios.interceptors.request.use((config) => {
  /*
   * If the data being sent in the request is form data, let the browser
   * automatically set the Content-Type header to multipart/form-data,
   * otherwise send it as application/json for all other requests
   */
  // if (config.data && config.data instanceof FormData) {
  //   delete config.headers["Content-Type"];
  // }
  let token = store.getters["getAccessToken"]
    ? store.getters["getAccessToken"]
    : localStorage.getItem("jwt");
  console.log(token);
  config.headers["Authorization"] = `Bearer ${token}`;
  console.log("config", config.headers);

  return config;
});
//
// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (err) => {
//     // Handle API call failures due to a problem with the user's internet connection
//     if (!err.response) {
//       const response = {
//         statusCode: HttpStatus.BAD_REQUEST, // TODO: change this status code to something more appropriate
//         error: "An unknown error occurred",
//       };
//
//       return Promise.reject(response);
//     }
//
//     // Handle API call failures due to an error received from the backend
//     return new Promise.reject(err);
//   }
// );

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const HttpClient = {
  async request(method, url, body = null, headers = null) {
    method = method.toLowerCase();

    if (!url.startsWith("http")) {
      url = this.buildUrl(url);
    }

    const axiosConfig = { method, url, data: body, headers };

    try {
      const response = await axios(axiosConfig);

      return response.data;
    } catch (err) {
      const response = { statusCode: HttpStatus.BAD_REQUEST };

      if (err.response) {
        response.error = err.response.data.error;

        // if ("errors" in err.response.data) {
        //   response.errors = err.response.data.errors;
        // }

        return response;
      }

      response.error = "An unknwon error occurred";

      return response;
    }
  },
  /**
   * Joins the base API URL with the specified API endpoint
   *
   * @param url The URL to add the base API URL to. If url starts with https://, url is returned
   *
   * @returns {string} The base API URL + the API endpoint
   */
  buildUrl(url) {
    if (url.startsWith("http")) {
      return url;
    }
    // Remove leading slash
    if (url.startsWith("/")) {
      url = url.substr(1, url.length);
    }

    // Remove trailing slash
    if (url.endsWith("/")) {
      url = url.substr(0, url.length - 1);
    }

    return `${process.env.VUE_APP_API_URL}/${url}`;
  },
  get(url, headers) {
    return this.request("GET", url, null, headers || defaultHeaders);
  },
  post(url, body, headers) {
    return this.request("POST", url, body, headers || defaultHeaders);
  },
  put(url, body, headers) {
    return this.request("PUT", url, body, headers || defaultHeaders);
  },
  patch(url, body, headers) {
    return this.request("PATCH", url, body, headers || defaultHeaders);
  },
  delete(url, headers) {
    return this.request("DELETE", url, null, headers || defaultHeaders);
  },
};
