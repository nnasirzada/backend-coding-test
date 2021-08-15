import 'reflect-metadata';
import { Database, verbose } from 'sqlite3';
import Container from 'typedi';
import buildSchemas from './src/schemas';
import app from './src/app';
import RideController from './src/controller/ride-controller';
import Logger from './src/logger/logger';

const port = 8010;

const sqlite3 = verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  buildSchemas(db);
  Container.set(Database, db);
  Container.set(typeof Logger, Logger);
  const rideController = Container.get(RideController);
  app(rideController).listen(port, () => Logger.info(`App started and listening on port ${port}`));
});
