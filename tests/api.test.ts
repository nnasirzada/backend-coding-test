import 'mocha';
import 'reflect-metadata';
import { Express } from 'express';
import { expect } from 'chai';
import request from 'supertest';
import { Database, verbose } from 'sqlite3';
import buildSchemas from '../src/schemas';
import App from '../src/app';
import Container from 'typedi';
import RideController from '../src/controller/ride-controller';

const sqlite3 = verbose();
let app: Express;

describe('API tests', () => {
    before((done) => {
        const db = new sqlite3.Database(':memory:');
        db.serialize(() => { 
            buildSchemas(db);
            Container.set(Database, db);
            const rideController = Container.get(RideController);
            app = App(rideController);
            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done: Mocha.Done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200)
                .then(response => {
                    expect(response.text).equal("Healthy");
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('GET /rides/1', () => {
        it('should respond with a ride not found error', (done: Mocha.Done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .expect(404)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("RIDES_NOT_FOUND_ERROR");
                    expect(error_message).equal("Could not find any ride matching rideId = 1");
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('POST /rides', () => {

        it('should respond with a validation error due to start_lat', (done: Mocha.Done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat": -100
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("VALIDATION_ERROR");
                    expect(error_message).equal("Start latitude must be between -90 - 90 degrees");
                    done();
                })
                .catch(err => done(err));
        });

        it('should respond with a validation error due to start_long', (done: Mocha.Done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat": 20,
                    "start_long": -190
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("VALIDATION_ERROR");
                    expect(error_message).equal("Start longitude must be between -180 to 180 degrees");
                    done();
                })
                .catch(err => done(err));
        });

        it('should respond with a validation error due to end_lat', (done: Mocha.Done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat": 20,
                    "start_long": 30,
                    "end_lat": 120
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("VALIDATION_ERROR");
                    expect(error_message).equal("End latitude must be between -90 - 90 degrees");
                    done();
                })
                .catch(err => done(err));
        });

        it('should respond with a validation error due to end_long', (done: Mocha.Done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat": 20,
                    "start_long": 30,
                    "end_lat": 40,
                    "end_long": 200
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("VALIDATION_ERROR");
                    expect(error_message).equal("End longitude must be between -180 to 180 degrees");
                    done();
                })
                .catch(err => done(err));
        });

        it('should respond with a validation error due to rider_name', (done: Mocha.Done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat": 20,
                    "start_long": 30,
                    "end_lat": 40,
                    "end_long": 50,
                    "rider_name": ""
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("VALIDATION_ERROR");
                    expect(error_message).equal("Rider name must be a non empty string");
                    done();
                })
                .catch(err => done(err));
        });

        it('should respond with a validation error due to driver_name', (done: Mocha.Done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat": 20,
                    "start_long": 30,
                    "end_lat": 40,
                    "end_long": 50,
                    "rider_name": "Nazar",
                    "driver_name": ""
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("VALIDATION_ERROR");
                    expect(error_message).equal("Driver name must be a non empty string");
                    done();
                })
                .catch(err => done(err));
        });

        it('should respond with a validation error due to driver_vehicle', (done: Mocha.Done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat": 20,
                    "start_long": 30,
                    "end_lat": 40,
                    "end_long": 50,
                    "rider_name": "Nazar",
                    "driver_name": "John",
                    "driver_vehicle": ""
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("VALIDATION_ERROR");
                    expect(error_message).equal("Driver vehicle must be a non empty string");
                    done();
                })
                .catch(err => done(err));
        });

        it('should create a ride and respond with the created ride', (done: Mocha.Done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat": 20,
                    "start_long": 30,
                    "end_lat": 40,
                    "end_long": 50,
                    "rider_name": "Nazar",
                    "driver_name": "John",
                    "driver_vehicle": "Prius 2016 Blue"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {rideID, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle, created} = response.body;
                    expect(rideID).equal(1);
                    expect(startLat).equal(20);
                    expect(startLong).equal(30);
                    expect(endLat).equal(40);
                    expect(endLong).equal(50);
                    expect(riderName).equal("Nazar");
                    expect(driverName).equal("John");
                    expect(driverVehicle).equal("Prius 2016 Blue");
                    expect(created).to.not.null;
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('GET /rides', () => {
        it('should respond with all rides', (done: Mocha.Done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an('array').with.length(1);
                    const {rideID, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle, created} = response.body[0];
                    expect(rideID).equal(1);
                    expect(startLat).equal(20);
                    expect(startLong).equal(30);
                    expect(endLat).equal(40);
                    expect(endLong).equal(50);
                    expect(riderName).equal("Nazar");
                    expect(driverName).equal("John");
                    expect(driverVehicle).equal("Prius 2016 Blue");
                    expect(created).to.not.null;
                    done();
                })
                .catch(err => done(err));
        });
    });
});