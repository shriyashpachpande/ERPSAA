/**
 * Custom XSS Input Sanitization Middleware
 * Recursively strips dangerous HTML and script tags from client input (body, query, params)
 * 100% compatible with Express 5 (mutates properties instead of overwriting read-only getters)
 */

const sanitizeHtml = (val) => {
  if (typeof val !== 'string') return val;
  // Strip out HTML tags completely using an optimized regex
  return val.replace(/<[^>]*>/g, '');
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key]);
      }
    }
  }
};

const xssSanitizer = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};

module.exports = xssSanitizer;
