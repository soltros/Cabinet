const stores = new Map();

const prune = (store, now) => {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
};

export const rateLimit = ({
  windowMs,
  max,
  keyGenerator = (req) => req.ip,
  message = 'Too many requests, please try again later.'
}) => {
  const store = new Map();
  stores.set(Symbol(), store);

  return (req, res, next) => {
    const now = Date.now();
    if (store.size > 10000) prune(store, now);

    const key = keyGenerator(req);
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > max) {
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({ error: message });
    }

    next();
  };
};
