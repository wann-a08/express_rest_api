import { AppError } from '../utils/AppError.js';

// source: 'body' | 'params' | 'query'
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return next(new AppError(422, 'Validasi gagal', details));
  }
  // Express 5: req.query read-only getter, jadi simpan hasil di req.validated
  req.validated = { ...(req.validated || {}), [source]: result.data };
  next();
};
