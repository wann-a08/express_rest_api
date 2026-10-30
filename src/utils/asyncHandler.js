// Bungkus handler async supaya error otomatis diteruskan ke error middleware
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
