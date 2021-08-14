import { verbose } from 'sqlite3';
import buildSchemas from './src/schemas';
import Logger from './src/logger/logger';
import app from './src/app';

const port = 8010;

const sqlite3 = verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  buildSchemas(db);
  app(db).listen(port, () => Logger.info(`App started and listening on port ${port}`));
});
