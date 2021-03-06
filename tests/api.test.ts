import 'mocha';
import 'reflect-metadata';
import { Application } from 'express';
import { expect } from 'chai';
import request from 'supertest';
import { Database, verbose } from 'sqlite3';
import buildSchemas from '../src/schemas';
import App from '../src/app';
import Container from 'typedi';
import RideController from '../src/controller/ride-controller';
import RideRepository from '../src/repository/ride-repository';
import Ride from '../src/model/ride';
import HealthController from '../src/controller/health-controller';

let app: Application;

describe('API tests', () => {
    before((done) => {
        const sqlite3 = verbose();
        const db = new sqlite3.Database(':memory:');
        db.serialize(() => { 
            buildSchemas(db);
            Container.set(Database, db);
            const rideController = Container.get(RideController);
            const healthController = Container.get(HealthController);
            app = App(healthController, rideController);
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
                .expect(201)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {ride_ID, start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle, created} = response.body;
                    expect(ride_ID).equal(1);
                    expect(start_lat).equal(20);
                    expect(start_long).equal(30);
                    expect(end_lat).equal(40);
                    expect(end_long).equal(50);
                    expect(rider_name).equal("Nazar");
                    expect(driver_name).equal("John");
                    expect(driver_vehicle).equal("Prius 2016 Blue");
                    expect(created).to.not.null;
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('GET /rides', () => {
        before(async () => {
            const rideRepository = Container.get(RideRepository);
            for (const name of ["Bob", "Therry", "Frank", "Mark"]) {
                await rideRepository.createRide(
                    new Ride(undefined, 50, 60, 70, 80, name, "Nazar", "Prius", undefined)
                );
            }
        });

        it('should respond with all rides', (done: Mocha.Done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    expect(response.body.totalRecords).equal(5);
                    expect(response.body.data).to.have.lengthOf(5);
                    const {ride_ID, start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle, created} = response.body.data[0];
                    expect(ride_ID).equal(5);
                    expect(start_lat).equal(50);
                    expect(start_long).equal(60);
                    expect(end_lat).equal(70);
                    expect(end_long).equal(80);
                    expect(rider_name).equal("Mark");
                    expect(driver_name).equal("Nazar");
                    expect(driver_vehicle).equal("Prius");
                    expect(created).to.not.null;
                    done();
                })
                .catch(err => done(err));
        });

        it('should skip first two rides and respond with next two three rides', (done: Mocha.Done) => {
            request(app)
                .get('/rides?limit=3&skip=2')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    expect(response.body.totalRecords).equal(5);
                    expect(response.body.data).to.have.lengthOf(3);
                    const {ride_ID, start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle, created} = response.body.data[0];
                    expect(ride_ID).equal(3);
                    expect(start_lat).equal(50);
                    expect(start_long).equal(60);
                    expect(end_lat).equal(70);
                    expect(end_long).equal(80);
                    expect(rider_name).equal("Therry");
                    expect(driver_name).equal("Nazar");
                    expect(driver_vehicle).equal("Prius");
                    expect(created).to.not.null;
                    done();
                })
                .catch(err => done(err));
        });

        it('should reset limit to 10 if limit is less than 1 or greater than 10', (done: Mocha.Done) => {
            request(app)
                .get('/rides?limit=-1&skip=0')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    expect(response.body.totalRecords).equal(5);
                    expect(response.body.data).to.have.lengthOf(5);
                    done();
                })
                .catch(err => done(err));
        });

        it('should reset skip to 0 if skip is less than 0', (done: Mocha.Done) => {
            request(app)
                .get('/rides?limit=10&skip=-10')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    expect(response.body.totalRecords).equal(5);
                    expect(response.body.data).to.have.lengthOf(5);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('GET /rides/:id', () => {
        it('should respond with a ride not found error', (done: Mocha.Done) => {
            request(app)
                .get('/rides/100')
                .expect('Content-Type', /json/)
                .expect(404)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {error_code, error_message} = response.body;
                    expect(error_code).equal("RIDES_NOT_FOUND_ERROR");
                    expect(error_message).equal("Could not find any ride matching rideId = 100");
                    done();
                })
                .catch(err => done(err));
        });

        it('should respond with a ride', (done: Mocha.Done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an('object');
                    const {ride_ID, start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle, created} = response.body;
                    expect(ride_ID).equal(1);
                    expect(start_lat).equal(20);
                    expect(start_long).equal(30);
                    expect(end_lat).equal(40);
                    expect(end_long).equal(50);
                    expect(rider_name).equal("Nazar");
                    expect(driver_name).equal("John");
                    expect(driver_vehicle).equal("Prius 2016 Blue");
                    expect(created).to.not.null;
                    done();
                })
                .catch(err => done(err));
        })
    });
});