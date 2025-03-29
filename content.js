// Function to inject the React Wallet API
function injectWalletProvider() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.type = 'text/javascript';
    
    script.onload = function() {
        this.remove();
    };

    // Inject the script into the page
    (document.head || document.documentElement).appendChild(script);
}

// Inject the wallet provider when the content script loads
injectWalletProvider();

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'NETWORK_CHANGED') {
        // Forward network change events to the page
        window.postMessage({
            type: 'REACT_WALLET_NETWORK_CHANGED',
            network: message.network
        }, '*');
    }
});

// Listen for messages from the page
window.addEventListener('message', (event) => {
    // Only accept messages from the same frame
    if (event.source !== window) {
        return;
    }

    // Only accept messages that we know are ours
    if (event.data.type && event.data.type.startsWith('REACT_WALLET_')) {
        // Forward the message to the background script
        chrome.runtime.sendMessage(event.data);
    }
}); 