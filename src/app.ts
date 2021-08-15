import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morganMiddleware from './logger/middleware/morgan';
import RideController from './controller/ride-controller';

export default (rideController: RideController) => {
  const app = express();
  const jsonParser = bodyParser.json();

  app.use(helmet());
  app.use(morganMiddleware);
  app.get('/health', (_, res) => res.send('Healthy'));
  app.post('/rides', jsonParser, (req, res) => rideController.createRide(req, res));
  app.get('/rides', (req, res) => rideController.getAllRides(req, res));
  app.get('/rides/:id', (req, res) => rideController.getRideById(req, res));
  return app;
};
