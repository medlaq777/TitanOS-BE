const levelOrder = { debug: 0, info: 1, warn: 2, error: 3 };

function parseEnvLevel() {
  const raw = process.env.LOG_LEVEL;
  if (raw && levelOrder[raw] !== undefined) return raw;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

const minLevel = parseEnvLevel();

function shouldLog(level) {
  return levelOrder[level] >= levelOrder[minLevel];
}

function normalizeArgs(first, second) {
  if (second !== undefined) {
    const obj = typeof first === "object" && first !== null ? { ...first } : {};
    return { ...obj, msg: String(second) };
  }
  if (typeof first === "string") {
    return { msg: first };
  }
  if (first && typeof first === "object") {
    const { msg, ...rest } = first;
    return { ...rest, ...(msg !== undefined ? { msg: String(msg) } : {}) };
  }
  return {};
}

function emit(level, first, second) {
  if (!shouldLog(level)) return;
  const ts = new Date().toISOString();
  const payload = {
    time: ts,
    level,
    service: "titanos-backend",
    ...normalizeArgs(first, second),
  };
  const line = JSON.stringify(payload);
  if (level === "error" || level === "warn") {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (a, b) => emit("debug", a, b),
  info: (a, b) => emit("info", a, b),
  warn: (a, b) => emit("warn", a, b),
  error: (a, b) => emit("error", a, b),
};
