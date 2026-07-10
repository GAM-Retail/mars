const SENSITIVE_KEYS = new Set(['password', 'token', 'authorization', 'cookie']);

function shouldRedact(key: string): boolean {
  return SENSITIVE_KEYS.has(key.toLowerCase());
}

function serialize(data: unknown): unknown {
  if (data instanceof Error) {
    return { name: data.name, message: data.message, stack: data.stack };
  }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      result[key] = shouldRedact(key) ? '[REDACTED]' : value;
    }
    return result;
  }
  if (Array.isArray(data)) {
    return data.map(serialize);
  }
  return data;
}

function log(level: 'info' | 'warn' | 'error', message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const args = data !== undefined ? [serialize(data)] : [];
  if (level === 'error') {
    console.error(prefix, message, ...args);
  } else if (level === 'warn') {
    console.warn(prefix, message, ...args);
  } else {
    console.log(prefix, message, ...args);
  }
}

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
};
