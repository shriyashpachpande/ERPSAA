/**
 * Unified Input Sanitizer Middleware
 * 
 * Protects the Express backend against:
 * 1. NoSQL Injection: Strips any keys starting with "$" or containing "." (MongoDB operators)
 * 2. Cross-Site Scripting (XSS): Recursively filters HTML/Script tags from string inputs
 * 
 * 100% Compatible with Express 5 (mutates internal properties instead of replacing read-only HTTP getters).
 */

const sanitizeHtml = (val) => {
  if (typeof val !== 'string') return val;
  // Strip out HTML tags completely using an optimized regex
  return val.replace(/<[^>]*>/g, '');
};

const isPlainObjectOrArray = (val) => {
  if (!val || typeof val !== 'object') return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype || Array.isArray(val);
};

const sanitizeInput = (obj) => {
  if (!obj || typeof obj !== 'object') return;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 1. NoSQL Injection Prevention: Strip MongoDB operator keys
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
        continue;
      }

      // 2. Recursive cleaning for nested plain objects/arrays only
      if (isPlainObjectOrArray(obj[key])) {
        sanitizeInput(obj[key]);
      } 
      // 3. XSS Prevention: Clean HTML tags from string values
      else if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key]);
      }
    }
  }
};

const inputSanitizer = (req, res, next) => {
  if (req.body) sanitizeInput(req.body);
  if (req.query) sanitizeInput(req.query);
  if (req.params) sanitizeInput(req.params);
  next();
};

module.exports = inputSanitizer;
