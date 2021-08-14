import express from 'express';
import { verbose } from 'sqlite3';
import buildSchemas from './src/schemas';

const app = express();
const port = 8010;

const sqlite3 = verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});