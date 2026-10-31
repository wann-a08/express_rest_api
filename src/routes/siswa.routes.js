import { Router } from 'express';
import { siswaController as c } from '../controllers/siswa.controller.js';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import {
  idParamSchema,
  createSiswaSchema,
  updateSiswaSchema,
  listQuerySchema,
} from '../validations/siswa.validation.js';

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), h(c.list));
router.get('/:id', validate(idParamSchema, 'params'), h(c.get));
router.post('/', validate(createSiswaSchema), h(c.create));
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateSiswaSchema),
  h(c.update),
);
router.delete('/:id', validate(idParamSchema, 'params'), h(c.remove));

export default router;
