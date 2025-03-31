// Background script for handling API communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'API_REQUEST') {
    const url = new URL(request.url);
    if (request.params) {
      Object.keys(request.params).forEach(key => 
        url.searchParams.append(key, request.params[key])
      );
    }

    fetch(url, {
      method: request.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers
      },
      body: request.body ? JSON.stringify(request.body) : undefined
    })
    .then(response => response.json())
    .then(data => sendResponse({ success: true, data }))
    .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
}); 