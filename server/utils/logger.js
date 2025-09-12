/**
 * Logger utility for GymVerse
 * Simple console logger with colors and timestamps
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  formatMessage(level, message, meta = null) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} [${level}] ${message}`;
    
    if (meta && typeof meta === 'object') {
      return `${formattedMessage}\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return formattedMessage;
  }

  info(message, meta = null) {
    const formatted = this.formatMessage('INFO', message, meta);
    if (this.isDevelopment) {
      console.log(`${colors.green}${formatted}${colors.reset}`);
    } else {
      console.log(formatted);
    }
  }

  warn(message, meta = null) {
    const formatted = this.formatMessage('WARN', message, meta);
    if (this.isDevelopment) {
      console.warn(`${colors.yellow}${formatted}${colors.reset}`);
    } else {
      console.warn(formatted);
    }
  }

  error(message, meta = null) {
    const formatted = this.formatMessage('ERROR', message, meta);
    if (this.isDevelopment) {
      console.error(`${colors.red}${formatted}${colors.reset}`);
    } else {
      console.error(formatted);
    }
  }

  debug(message, meta = null) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('DEBUG', message, meta);
      console.log(`${colors.cyan}${formatted}${colors.reset}`);
    }
  }

  success(message, meta = null) {
    const formatted = this.formatMessage('SUCCESS', message, meta);
    if (this.isDevelopment) {
      console.log(`${colors.green}${colors.bright}${formatted}${colors.reset}`);
    } else {
      console.log(formatted);
    }
  }

  http(message, meta = null) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('HTTP', message, meta);
      console.log(`${colors.magenta}${formatted}${colors.reset}`);
    }
  }
}

const logger = new Logger();

module.exports = logger;
