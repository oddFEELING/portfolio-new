/** biome-ignore-all lint/suspicious/noConsole: Browser logging needed */
import pino from "pino";

// Regex to extract filename from stack trace
const STACK_TRACE_REGEX = /\(([^)]+):(\d+):(\d+)\)/;

// Patterns to exclude from stack trace (bundled/internal files)
const EXCLUDED_PATTERNS = [
  /\?v=/, // Vite bundled files with hash
  /node_modules/, // Third-party packages
  /pino/, // Pino logger itself
  /react-dom/, // React DOM runtime
  /react\.js/, // React runtime
  /@react-router/, // Router runtime
  /vite\/dist/, // Vite internal
];

// Check if a frame should be excluded
const isExcludedFrame = (filepath: string): boolean =>
  EXCLUDED_PATTERNS.some((pattern) => pattern.test(filepath));

// Check if running in browser environment
const isBrowser = (): boolean => typeof window !== "undefined";

// Log with browser console for better visibility
const logWithConsoleGroup = (
  level: LogLevel,
  context: LoggerContext,
  logEntry: LogEntry
) => {
  // Determine console method based on level
  const consoleMethod = level === "error" ? console.error : console.log;

  // Create the main message with context and level
  const message = `[${level.toUpperCase()}] ${context}`;

  // Log context as the main message, followed by the entry data
  consoleMethod(message, logEntry);
};

// Environment aliases for log levels
type Environment = "development" | "staging" | "production";

// Type definitions for logger context and data
type LoggerContext = string;
type LoggerData = Record<string, unknown>;

type LogEntry = {
  data?: LoggerData;
  file: string;
  timestamp: string;
};

// Environment-specific log level configuration
const getLogLevelByEnvironment = (env: Environment): string => {
  switch (env) {
    case "development": {
      return "debug";
    }
    case "staging": {
      return "info";
    }
    case "production": {
      return "warn";
    }
    default: {
      return "info";
    }
  }
};

// Extract current environment
const currentEnvironment: Environment = (() => {
  const env = import.meta.env.VITE_NODE_ENV || "development";
  if (env === "development" || env === "staging" || env === "production") {
    return env;
  }
  return "development";
})();

// Extract the source path from a full file path
const extractSourcePath = (filepath: string): string => {
  // Try to find path from app folder
  const rootIndex = filepath.indexOf("/app/");
  if (rootIndex !== -1) {
    return filepath.substring(rootIndex + 1);
  }

  // Fallback to just filename
  return filepath.split("/").pop() || "unknown";
};

// Extract full file path from root for tracking
const getCallerFilePath = (): string => {
  try {
    const stack = new Error("Stack trace extraction").stack;
    if (!stack) {
      return "unknown";
    }

    const lines = stack.split("\n");

    // Find the first frame that is not from excluded patterns
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines.at(i);
      if (!line) {
        continue;
      }

      const match = line.match(STACK_TRACE_REGEX);
      if (match) {
        const filepath = match[1];

        // Skip excluded frames (bundled, node_modules, internal)
        if (isExcludedFrame(filepath)) {
          continue;
        }

        return extractSourcePath(filepath);
      }
    }

    return "unknown";
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to extract caller file path: ${errorMessage}`);
  }
};

// Initialize pino logger with environment-specific settings
const baseLogger = pino({
  base: null,
  level: getLogLevelByEnvironment(currentEnvironment),
  transport:
    currentEnvironment === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  browser: {
    asObject: true,
  },
});

// Map of log level methods
type LogLevel = "debug" | "info" | "warn" | "error" | "trace";

// Enhanced logger with context, data, and filename support
const logger = {
  // Generic log method with context and data
  log: (level: LogLevel, context: LoggerContext, data?: LoggerData) => {
    const filename = getCallerFilePath();
    const logEntry: LogEntry = {
      ...(data && { data }),
      file: filename,
      timestamp: new Date().toISOString(),
    };

    // Use browser console groups for better visibility
    if (isBrowser()) {
      logWithConsoleGroup(level, context, logEntry);
      return;
    }

    // Use pino for server/production environments
    const logMethod = baseLogger[level];
    if (typeof logMethod === "function") {
      logMethod.call(baseLogger, logEntry, context);
    }
  },

  // Debug level
  debug: (context: LoggerContext, data?: LoggerData) => {
    logger.log("debug", context, data);
  },

  // Info level
  info: (context: LoggerContext, data?: LoggerData) => {
    logger.log("info", context, data);
  },

  // Warn level
  warn: (context: LoggerContext, data?: LoggerData) => {
    logger.log("warn", context, data);
  },

  // Error level
  error: (context: LoggerContext, data?: LoggerData) => {
    logger.log("error", context, data);
  },

  // Trace level
  trace: (context: LoggerContext, data?: LoggerData) => {
    logger.log("trace", context, data);
  },

  // Get current environment
  getEnvironment: (): Environment => currentEnvironment,
};

export { logger };
