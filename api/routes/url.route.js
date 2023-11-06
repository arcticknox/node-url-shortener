import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import urlController from '../controllers/url.controller.js';

const router = express.Router();
const path = '/url';

router.post(
    '/generate',
    authMiddleware(),
    urlController.generate,
);

router.route('/')
    .get(
        authMiddleware(),
        urlController.getAllUrls,
    );

router.route('/:shortUrl')
    .get(urlController.resolve)
    .delete(authMiddleware(), urlController.deleteUrl);

export {
  router,
  path,
};
