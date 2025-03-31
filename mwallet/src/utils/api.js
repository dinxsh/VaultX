/* global chrome */
export const makeApiRequest = async (url, options = {}) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'API_REQUEST',
        url,
        method: options.method || 'GET',
        headers: options.headers || {},
        params: options.params,
        body: options.body
      },
      response => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
      }
    );
  });
};

export const API_BASE_URL = 'http://localhost:3001'; 