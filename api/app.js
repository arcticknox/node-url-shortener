import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import morgan from 'morgan';
import centralErrorHandler from './utils/centralErrorHandler.js';
import errorHandlerMiddleware from './middlewares/error.middleware.js';
import responseHandler from './utils/responseHandler.js';
import passport from 'passport';
import jwtStrategy from './utils/jwtStrategy.js';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json()); // Parse json
app.use(express.urlencoded({ extended: true }));
// JWT auth strategy
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// Load routes
app.use(routes);
app.use(errorHandlerMiddleware);
// Centralized error handler
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});

// Healthcheck endpoint
app.get('/healthz', (req, res) => {
  responseHandler(req, res, null, 200);
});

export default app;
