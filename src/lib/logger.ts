import { cyan, green, magenta, red, white, yellow } from 'ansis';

type Method = 'info' | 'warn' | 'error' | 'success' | 'loading';

const DISABLE_IN_PRODUCTION = false;

const APP_NAME = cyan.bold` [${import.meta.env.VITE_APP_NAME}] `;

const prefixes: Record<Method, string> = {
  info: white`[INFO]`,
  warn: yellow`[WARN]`,
  error: red`[ERROR]`,
  success: green`[SUCCESS]`,
  loading: magenta`[LOADING]`,
};

const methods: Record<Method, 'log' | 'error'> = {
  info: 'log',
  warn: 'error',
  error: 'error',
  success: 'log',
  loading: 'log',
};

function loggerFactory(method: Method): (...message: unknown[]) => void {
  return (...message: unknown[]) => {
    if (DISABLE_IN_PRODUCTION && import.meta.env.PROD) {
      return;
    }

    const consoleLogger = console[methods[method]];
    const prefix = `${APP_NAME}${prefixes[method]}`;

    consoleLogger(prefix, ...message);
  };
}

const logger: Record<Method, (...message: unknown[]) => void> = {
  info: loggerFactory('info'),
  warn: loggerFactory('warn'),
  error: loggerFactory('error'),
  success: loggerFactory('success'),
  loading: loggerFactory('loading'),
};

export { logger };
