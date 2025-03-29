// React Wallet Extension API
class ReactWallet {
    constructor() {
        this.connected = false;
        this.network = null;
        this.account = null;
        this.listeners = new Map();
    }

    // Connect to the wallet
    async connect(network = 'ethereum') {
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'CONNECT_WALLET',
                network
            });

            if (response.error) {
                throw new Error(response.error);
            }

            this.connected = true;
            this.network = response.network;
            this.account = response.address;

            this._notifyListeners('connect', { network: this.network, account: this.account });
            return { network: this.network, account: this.account };
        } catch (error) {
            this._notifyListeners('error', { message: error.message });
            throw error;
        }
    }

    // Disconnect from the wallet
    async disconnect() {
        this.connected = false;
        this.network = null;
        this.account = null;
        this._notifyListeners('disconnect');
    }

    // Get connected account
    async getAccounts() {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        return [this.account];
    }

    // Sign a transaction
    async signTransaction(transaction) {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }

        try {
            const response = await chrome.runtime.sendMessage({
                type: 'SIGN_TRANSACTION',
                transaction,
                network: this.network
            });

            if (response.error) {
                throw new Error(response.error);
            }

            return response.signedTransaction;
        } catch (error) {
            this._notifyListeners('error', { message: error.message });
            throw error;
        }
    }

    // Switch network
    async switchNetwork(network) {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }

        try {
            const response = await chrome.runtime.sendMessage({
                type: 'SWITCH_NETWORK',
                network
            });

            if (response.error) {
                throw new Error(response.error);
            }

            this.network = response.network;
            this._notifyListeners('networkChanged', { network: this.network });
            return this.network;
        } catch (error) {
            this._notifyListeners('error', { message: error.message });
            throw error;
        }
    }

    // Add event listener
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    // Remove event listener
    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    // Notify listeners of an event
    _notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} event listener:`, error);
                }
            });
        }
    }
}

// Create global instance
window.reactWallet = new ReactWallet();

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'NETWORK_CHANGED') {
        window.reactWallet.network = message.network;
        window.reactWallet._notifyListeners('networkChanged', { network: message.network });
    }
}); 