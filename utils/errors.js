// Custom error classes for different types of errors
class WalletError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'WalletError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

class NetworkError extends WalletError {
    constructor(message, details = {}) {
        super(message, 'NETWORK_ERROR', details);
        this.name = 'NetworkError';
    }
}

class TransactionError extends WalletError {
    constructor(message, details = {}) {
        super(message, 'TRANSACTION_ERROR', details);
        this.name = 'TransactionError';
    }
}

class SecurityError extends WalletError {
    constructor(message, details = {}) {
        super(message, 'SECURITY_ERROR', details);
        this.name = 'SecurityError';
    }
}

class ValidationError extends WalletError {
    constructor(message, details = {}) {
        super(message, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

// Error codes and messages
const ErrorCodes = {
    // Network errors (1000-1999)
    NETWORK_NOT_SUPPORTED: 1000,
    NETWORK_SWITCH_FAILED: 1001,
    NETWORK_CONNECTION_FAILED: 1002,
    NETWORK_TIMEOUT: 1003,
    
    // Transaction errors (2000-2999)
    TRANSACTION_SIGNING_FAILED: 2000,
    TRANSACTION_SENDING_FAILED: 2001,
    TRANSACTION_INVALID: 2002,
    TRANSACTION_REJECTED: 2003,
    TRANSACTION_TIMEOUT: 2004,
    INSUFFICIENT_FUNDS: 2005,
    
    // Security errors (3000-3999)
    WALLET_NOT_CONNECTED: 3000,
    WALLET_LOCKED: 3001,
    INVALID_PRIVATE_KEY: 3002,
    UNAUTHORIZED_ACCESS: 3003,
    SIGNATURE_VERIFICATION_FAILED: 3004,
    
    // Validation errors (4000-4999)
    INVALID_ADDRESS: 4000,
    INVALID_AMOUNT: 4001,
    INVALID_TOKEN: 4002,
    INVALID_PARAMETERS: 4003,
    
    // General errors (5000-5999)
    UNKNOWN_ERROR: 5000,
    STORAGE_ERROR: 5001,
    COMMUNICATION_ERROR: 5002,
    EXTENSION_ERROR: 5003
};

// Error message templates
const ErrorMessages = {
    [ErrorCodes.NETWORK_NOT_SUPPORTED]: 'Network {network} is not supported',
    [ErrorCodes.NETWORK_SWITCH_FAILED]: 'Failed to switch to network {network}',
    [ErrorCodes.NETWORK_CONNECTION_FAILED]: 'Failed to connect to network {network}',
    [ErrorCodes.NETWORK_TIMEOUT]: 'Network request timed out',
    
    [ErrorCodes.TRANSACTION_SIGNING_FAILED]: 'Failed to sign transaction: {reason}',
    [ErrorCodes.TRANSACTION_SENDING_FAILED]: 'Failed to send transaction: {reason}',
    [ErrorCodes.TRANSACTION_INVALID]: 'Invalid transaction: {reason}',
    [ErrorCodes.TRANSACTION_REJECTED]: 'Transaction was rejected',
    [ErrorCodes.TRANSACTION_TIMEOUT]: 'Transaction timed out',
    [ErrorCodes.INSUFFICIENT_FUNDS]: 'Insufficient funds for transaction',
    
    [ErrorCodes.WALLET_NOT_CONNECTED]: 'Wallet is not connected',
    [ErrorCodes.WALLET_LOCKED]: 'Wallet is locked',
    [ErrorCodes.INVALID_PRIVATE_KEY]: 'Invalid private key',
    [ErrorCodes.UNAUTHORIZED_ACCESS]: 'Unauthorized access attempt',
    [ErrorCodes.SIGNATURE_VERIFICATION_FAILED]: 'Signature verification failed',
    
    [ErrorCodes.INVALID_ADDRESS]: 'Invalid address: {address}',
    [ErrorCodes.INVALID_AMOUNT]: 'Invalid amount: {amount}',
    [ErrorCodes.INVALID_TOKEN]: 'Invalid token: {token}',
    [ErrorCodes.INVALID_PARAMETERS]: 'Invalid parameters: {params}',
    
    [ErrorCodes.UNKNOWN_ERROR]: 'An unknown error occurred',
    [ErrorCodes.STORAGE_ERROR]: 'Storage error: {reason}',
    [ErrorCodes.COMMUNICATION_ERROR]: 'Communication error: {reason}',
    [ErrorCodes.EXTENSION_ERROR]: 'Extension error: {reason}'
};

// Error handling utility
const ErrorHandler = {
    // Create a formatted error message
    formatMessage(code, details = {}) {
        let message = ErrorMessages[code] || ErrorMessages[ErrorCodes.UNKNOWN_ERROR];
        Object.entries(details).forEach(([key, value]) => {
            message = message.replace(`{${key}}`, value);
        });
        return message;
    },

    // Create a new error with the appropriate class
    createError(code, details = {}) {
        const message = this.formatMessage(code, details);
        
        if (code >= 1000 && code < 2000) {
            return new NetworkError(message, details);
        } else if (code >= 2000 && code < 3000) {
            return new TransactionError(message, details);
        } else if (code >= 3000 && code < 4000) {
            return new SecurityError(message, details);
        } else if (code >= 4000 && code < 5000) {
            return new ValidationError(message, details);
        } else {
            return new WalletError(message, code, details);
        }
    },

    // Log error with additional context
    logError(error, context = {}) {
        const errorLog = {
            name: error.name,
            message: error.message,
            code: error.code,
            details: error.details,
            context,
            timestamp: error.timestamp,
            stack: error.stack
        };

        // Log to console
        console.error('[Wallet Error]', errorLog);

        // Send to background script for storage
        chrome.runtime.sendMessage({
            type: 'LOG_ERROR',
            error: errorLog
        });

        return errorLog;
    },

    // Validate transaction parameters
    validateTransaction(transaction, network) {
        if (!transaction) {
            throw this.createError(ErrorCodes.TRANSACTION_INVALID, {
                reason: 'Transaction object is required'
            });
        }

        if (!transaction.to) {
            throw this.createError(ErrorCodes.INVALID_ADDRESS, {
                address: 'recipient address'
            });
        }

        if (!transaction.amount || transaction.amount <= 0) {
            throw this.createError(ErrorCodes.INVALID_AMOUNT, {
                amount: transaction.amount
            });
        }

        // Network-specific validation
        if (network === 'solana') {
            if (transaction.tokenMint && !this.isValidSolanaAddress(transaction.tokenMint)) {
                throw this.createError(ErrorCodes.INVALID_TOKEN, {
                    token: transaction.tokenMint
                });
            }
        }

        return true;
    },

    // Validate network
    validateNetwork(network) {
        if (!network) {
            throw this.createError(ErrorCodes.NETWORK_NOT_SUPPORTED, {
                network: 'undefined'
            });
        }

        const supportedNetworks = ['ethereum', 'solana'];
        if (!supportedNetworks.includes(network)) {
            throw this.createError(ErrorCodes.NETWORK_NOT_SUPPORTED, {
                network
            });
        }

        return true;
    },

    // Validate Solana address
    isValidSolanaAddress(address) {
        try {
            // Basic Solana address validation
            return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
        } catch (error) {
            return false;
        }
    }
};

export { ErrorHandler, ErrorCodes, WalletError, NetworkError, TransactionError, SecurityError, ValidationError }; 