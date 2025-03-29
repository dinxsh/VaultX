// Log levels
class Logger {
    static levels = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    static currentLevel = Logger.levels.INFO;

    static setLevel(level) {
        Logger.currentLevel = level;
    }

    static debug(message, data = null) {
        if (Logger.currentLevel <= Logger.levels.DEBUG) {
            console.debug(`[DEBUG] ${message}`, data || '');
        }
    }

    static info(message, data = null) {
        if (Logger.currentLevel <= Logger.levels.INFO) {
            console.info(`[INFO] ${message}`, data || '');
        }
    }

    static warn(message, data = null) {
        if (Logger.currentLevel <= Logger.levels.WARN) {
            console.warn(`[WARN] ${message}`, data || '');
        }
    }

    static error(message, error = null) {
        if (Logger.currentLevel <= Logger.levels.ERROR) {
            console.error(`[ERROR] ${message}`, error || '');
            
            // Log error details if available
            if (error) {
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
            }
        }
    }

    static formatError(error) {
        if (!error) return 'Unknown error';
        
        return {
            name: error.name || 'Error',
            message: error.message || 'An unknown error occurred',
            stack: error.stack
        };
    }
}

export default Logger; 