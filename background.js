// Logger implementation for background script
const Logger = {
    debug: function(message, data = null) {
        console.debug(`[React Wallet] ${message}`, data || '');
    },
    info: function(message, data = null) {
        console.info(`[React Wallet] ${message}`, data || '');
    },
    warn: function(message, data = null) {
        console.warn(`[React Wallet] ${message}`, data || '');
    },
    error: function(message, error = null) {
        console.error(`[React Wallet] ${message}`, error || '');
    }
};

// Import error handling utilities
const { ErrorHandler, ErrorCodes } = require('./utils/errors');

// Supported networks
const SUPPORTED_NETWORKS = {
    ethereum: {
        name: 'Ethereum',
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3/',
        symbol: 'ETH'
    },
    solana: {
        name: 'Solana',
        chainId: '0x1',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        symbol: 'SOL'
    }
};

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        switch (request.type) {
            case 'CONNECT_WALLET':
                handleWalletConnection(request, sendResponse);
                return true;
            case 'SIGN_TRANSACTION':
                handleTransactionSigning(request, sendResponse);
                return true;
            case 'SWITCH_NETWORK':
                handleNetworkSwitch(request, sendResponse);
                return true;
            case 'LOG_ERROR':
                handleErrorLog(request);
                break;
            default:
                throw ErrorHandler.createError(ErrorCodes.EXTENSION_ERROR, {
                    reason: `Unknown message type: ${request.type}`
                });
        }
    } catch (error) {
        const errorLog = ErrorHandler.logError(error, {
            request,
            sender: sender.tab?.url
        });
        sendResponse({ error: errorLog.message, code: errorLog.code });
    }
});

async function handleWalletConnection(request, sendResponse) {
    try {
        Logger.debug('Handling wallet connection request', { 
            sender: sender.tab?.url,
            network: request.network 
        });

        // Validate network
        ErrorHandler.validateNetwork(request.network);

        // Get the current wallet state
        const walletState = await chrome.storage.local.get(['wallet', 'network'])
            .catch(error => {
                throw ErrorHandler.createError(ErrorCodes.STORAGE_ERROR, {
                    reason: error.message
                });
            });
        
        if (!walletState.wallet) {
            throw ErrorHandler.createError(ErrorCodes.WALLET_NOT_CONNECTED);
        }

        // Update network if different
        if (walletState.network !== request.network) {
            await chrome.storage.local.set({ network: request.network })
                .catch(error => {
                    throw ErrorHandler.createError(ErrorCodes.STORAGE_ERROR, {
                        reason: error.message
                    });
                });
        }

        // Send wallet info to the content script
        sendResponse({
            address: walletState.wallet.address,
            network: request.network
        });
        Logger.info('Wallet connection successful');
    } catch (error) {
        const errorLog = ErrorHandler.logError(error, {
            request,
            sender: sender.tab?.url
        });
        sendResponse({ error: errorLog.message, code: errorLog.code });
    }
}

async function handleTransactionSigning(request, sendResponse) {
    try {
        Logger.debug('Handling transaction signing request', {
            network: request.network,
            transaction: request.transaction
        });

        // Validate network and transaction
        ErrorHandler.validateNetwork(request.network);
        ErrorHandler.validateTransaction(request.transaction, request.network);

        // Get wallet state
        const walletState = await chrome.storage.local.get(['wallet', 'network'])
            .catch(error => {
                throw ErrorHandler.createError(ErrorCodes.STORAGE_ERROR, {
                    reason: error.message
                });
            });
        
        if (!walletState.wallet) {
            throw ErrorHandler.createError(ErrorCodes.WALLET_NOT_CONNECTED);
        }

        // Validate network match
        if (walletState.network !== request.network) {
            throw ErrorHandler.createError(ErrorCodes.NETWORK_SWITCH_FAILED, {
                network: request.network
            });
        }

        // Sign transaction based on network
        const signedTransaction = await signTransactionWithNetwork(
            request.transaction,
            request.network,
            walletState.wallet
        );

        sendResponse({ signedTransaction });
        Logger.info('Transaction signed successfully');
    } catch (error) {
        const errorLog = ErrorHandler.logError(error, {
            request,
            sender: sender.tab?.url
        });
        sendResponse({ error: errorLog.message, code: errorLog.code });
    }
}

async function handleNetworkSwitch(request, sendResponse) {
    try {
        Logger.debug('Handling network switch request', {
            from: request.network,
            to: request.newNetwork
        });

        // Validate new network
        ErrorHandler.validateNetwork(request.newNetwork);

        // Update network in storage
        await chrome.storage.local.set({ network: request.newNetwork })
            .catch(error => {
                throw ErrorHandler.createError(ErrorCodes.STORAGE_ERROR, {
                    reason: error.message
                });
            });

        // Notify all tabs about network change
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'NETWORK_CHANGED',
                    network: request.newNetwork
                }).catch(error => {
                    Logger.warn('Failed to notify tab about network change', {
                        tabId: tab.id,
                        error: error.message
                    });
                });
            });
        });

        sendResponse({ network: request.newNetwork });
        Logger.info('Network switched successfully');
    } catch (error) {
        const errorLog = ErrorHandler.logError(error, {
            request,
            sender: sender.tab?.url
        });
        sendResponse({ error: errorLog.message, code: errorLog.code });
    }
}

async function handleErrorLog(request) {
    try {
        const { message, error, timestamp } = request;
        Logger.error(message, error);

        // Store error in chrome.storage
        const { errorLogs = [] } = await chrome.storage.local.get(['errorLogs'])
            .catch(error => {
                throw ErrorHandler.createError(ErrorCodes.STORAGE_ERROR, {
                    reason: error.message
                });
            });
        
        errorLogs.unshift({ message, error, timestamp });
        
        // Keep only last 100 errors
        if (errorLogs.length > 100) {
            errorLogs.pop();
        }
        
        await chrome.storage.local.set({ errorLogs })
            .catch(error => {
                throw ErrorHandler.createError(ErrorCodes.STORAGE_ERROR, {
                    reason: error.message
                });
            });
    } catch (error) {
        const errorLog = ErrorHandler.logError(error, {
            request
        });
        console.error('Failed to handle error log:', errorLog);
    }
}

// Network-specific transaction signing
async function signTransactionWithNetwork(transaction, network, wallet) {
    try {
        switch (network) {
            case 'solana':
                return await signSolanaTransaction(transaction, wallet);
            case 'ethereum':
                throw ErrorHandler.createError(ErrorCodes.TRANSACTION_SIGNING_FAILED, {
                    reason: 'Ethereum transaction signing not implemented'
                });
            default:
                throw ErrorHandler.createError(ErrorCodes.NETWORK_NOT_SUPPORTED, {
                    network
                });
        }
    } catch (error) {
        throw ErrorHandler.createError(ErrorCodes.TRANSACTION_SIGNING_FAILED, {
            reason: error.message
        });
    }
}

// Solana transaction signing implementation
async function signSolanaTransaction(transaction, wallet) {
    try {
        const {
            createTransaction,
            createTokenTransaction,
            signTransaction,
            sendTransaction
        } = require('./utils/solana.js');

        let solanaTransaction;
        
        // Handle different transaction types
        if (transaction.tokenMint) {
            // Token transfer transaction
            solanaTransaction = await createTokenTransaction(
                wallet.address,
                transaction.to,
                transaction.amount,
                transaction.tokenMint,
                transaction.decimals || 9
            );
        } else {
            // SOL transfer transaction
            solanaTransaction = createTransaction(
                wallet.address,
                transaction.to,
                transaction.amount
            );
        }

        // Sign the transaction
        const signedTx = signTransaction(solanaTransaction, wallet.privateKey);

        // Send the transaction
        const signature = await sendTransaction(signedTx);

        return {
            signature,
            transaction: signedTx
        };
    } catch (error) {
        throw ErrorHandler.createError(ErrorCodes.TRANSACTION_SIGNING_FAILED, {
            reason: error.message
        });
    }
}

// Log extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
    try {
        if (details.reason === 'install') {
            Logger.info('Extension installed');
        } else if (details.reason === 'update') {
            Logger.info('Extension updated', { 
                previousVersion: details.previousVersion,
                currentVersion: chrome.runtime.getManifest().version
            });
        }
    } catch (error) {
        const errorLog = ErrorHandler.logError(error, {
            details
        });
        console.error('Failed to handle extension installation:', errorLog);
    }
}); 