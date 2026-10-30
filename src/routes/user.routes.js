import { Router } from 'express';
import { userController as c } from '../controllers/user.controller.js';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
  listQuerySchema,
} from '../validations/user.validation.js';

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), h(c.list));
router.get('/:id', validate(idParamSchema, 'params'), h(c.get));
router.post('/', validate(createUserSchema), h(c.create));
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateUserSchema),
  h(c.update),
);
router.delete('/:id', validate(idParamSchema, 'params'), h(c.remove));

export default router;
