'use strict';

import 'mocha';
import request from 'supertest';
import { verbose } from 'sqlite3';

const sqlite3 = verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
    before((done) => {
        db.serialize(() => { 
            buildSchemas(db);
            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done: Mocha.Done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });
});