import 'reflect-metadata';
import { Database, verbose } from 'sqlite3';
import Container from 'typedi';
import buildSchemas from './src/schemas';
import app from './src/app';
import RideController from './src/controller/ride-controller';
import Logger from './src/logger/logger';
import HealthController from './src/controller/health-controller';

const port = 8010;

const sqlite3 = verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  buildSchemas(db);
  // Define database and logger dependencies globally
  Container.set(Database, db);
  Container.set(typeof Logger, Logger);
  const healthController = Container.get(HealthController);
  const rideController = Container.get(RideController);
  // Inject dependencies and start the server
  app(healthController, rideController).listen(port, () => Logger.info(`App started and listening on port ${port}`));
});
