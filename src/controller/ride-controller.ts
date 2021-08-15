import { Request, Response } from 'express';
import {
  ApiOperationGet, ApiOperationPost, ApiPath, SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { Service } from 'typedi';
import Logger from '../logger/logger';
import ApiError from '../model/api-error';
import Ride from '../model/ride';
import RideService from '../service/ride-service';

function handleError(error: any, res: Response) {
  Logger.error(error);
  let errorStatus = 500;
  if (error.error_code) {
    switch (error.error_code) {
      case ApiError.RIDES_NOT_FOUND_ERROR:
        errorStatus = 404;
        break;
      case ApiError.VALIDATION_ERROR:
        errorStatus = 400;
        break;
      default:
        errorStatus = 500;
    }
  }
  return res.status(errorStatus).json(error);
}

@Service()
@ApiPath({
  path: '/rides',
  name: 'Ride',
})
class RideController {
  constructor(private readonly rideService: RideService) {}

  @ApiOperationGet({
    description: 'Retrieves list of all rides',
    summary: 'Get rides',
    responses: {
      200: { description: 'Success', type: SwaggerDefinitionConstant.Response.Type.ARRAY, model: 'Ride' },
      404: { description: 'Not found', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'API Error' },
    },
    parameters: {
      query: {
        limit: {
          name: 'limit',
          description: 'Number of records to retrieve. Max = 10',
          allowEmptyValue: true,
        },
        skip: {
          name: 'skip',
          description: 'Number of records to skip. Default = 0',
          allowEmptyValue: true,
        },
      },
    },
  })
  async getAllRides(req: Request, res: Response) {
    try {
      let recordLimit = Number(req.query.limit) || 10;
      let recordSkip = Number(req.query.skip) || 0;

      if (recordLimit > 10 || recordLimit < 1) {
        recordLimit = 10;
      }

      if (recordSkip < 0) {
        recordSkip = 0;
      }

      const [rides, ridesCount] = await Promise.all([
        this.rideService.getAllRides(recordLimit, recordSkip),
        this.rideService.getRidesCount(),
      ]);
      return res.json({
        totalRecords: ridesCount,
        data: rides,
      });
    } catch (error) {
      return handleError(error, res);
    }
  }

  @ApiOperationGet({
    path: '/{rideID}',
    description: 'Retrieves a single ride',
    summary: 'Get a ride',
    responses: {
      200: { description: 'Success', type: SwaggerDefinitionConstant.Response.Type.ARRAY, model: 'Ride' },
      404: { description: 'Not found', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'API Error' },
    },
    parameters: {
      path: {
        rideID: {
          name: 'rideID',
          description: 'ID number of ride',
          allowEmptyValue: false,
        },
      },
    },
  })
  async getRideById(req: Request, res: Response) {
    try {
      const rideId = Number(req.params.id);
      const ride = await this.rideService.getRideById(rideId);
      return res.json(ride);
    } catch (error) {
      return handleError(error, res);
    }
  }

  @ApiOperationPost({
    description: 'Creates new ride',
    summary: 'Create new ride',
    parameters: {
      body: { description: 'New ride', required: true, model: 'Ride' },
    },
    responses: {
      201: { description: 'Success', type: SwaggerDefinitionConstant.Response.Type.ARRAY, model: 'Ride' },
      400: { description: 'Parameters fail', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'API Error' },
    },
  })
  async createRide(req: Request, res: Response) {
    try {
      const startLatitude = Number(req.body.start_lat);
      const startLongitude = Number(req.body.start_long);
      const endLatitude = Number(req.body.end_lat);
      const endLongitude = Number(req.body.end_long);
      const riderName = req.body.rider_name;
      const driverName = req.body.driver_name;
      const driverVehicle = req.body.driver_vehicle;

      const ride = new Ride(
        undefined,
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
        riderName,
        driverName,
        driverVehicle,
        undefined,
      );
      const createdRideId = await this.rideService.createRide(ride);
      const createdRide = await this.rideService.getRideById(createdRideId);
      return res.status(201).json(createdRide);
    } catch (error) {
      return handleError(error, res);
    }
  }
}

export default RideController;
