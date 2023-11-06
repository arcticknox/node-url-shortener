import express from 'express';
import authController from '../controllers/auth.controller.js';

import requestValidatorMiddleware from '../middlewares/reqvalidator.middleware.js';
import authValidations from '../validations/auth.validation.js';

const router = express.Router();
const path = '/auth';

router.post(
    '/register',
    requestValidatorMiddleware(authValidations.register),
    authController.register,
);
router.post(
    '/login',
    requestValidatorMiddleware(authValidations.login),
    authController.loginWithEmail,
);
router.post(
    '/logout',
    requestValidatorMiddleware(authValidations.logout),
    authController.logout,
);
router.post(
    '/refresh-tokens',
    requestValidatorMiddleware(authValidations.refreshTokens),
    authController.refreshTokens,
);

export {
  router,
  path,
};
