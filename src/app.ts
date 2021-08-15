import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import * as swagger from 'swagger-express-ts';
import morganMiddleware from './logger/middleware/morgan';
import RideController from './controller/ride-controller';
import HealthController from './controller/health-controller';

export default (healthController: HealthController, rideController: RideController) => {
  const app = express();
  const jsonParser = bodyParser.json();

  app.use(helmet());
  app.use(morganMiddleware);
  app.use('/api-docs/swagger', express.static('swagger'));
  app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
  app.use(swagger.express(
    {
      definition: {
        info: {
          title: 'Xendit Backend Task - REST API Swagger Documentation',
          version: '1.0',
          contact: {
            name: 'Nazar Nasirzada',
            email: 'nnasirzada2018@ada.edu.az',
          },
        },
      },
    },
  ));
  app.get('/health', (req, res) => healthController.getHealth(req, res));
  app.post('/rides', jsonParser, (req, res) => rideController.createRide(req, res));
  app.get('/rides', (req, res) => rideController.getAllRides(req, res));
  app.get('/rides/:id', (req, res) => rideController.getRideById(req, res));
  return app;
};
