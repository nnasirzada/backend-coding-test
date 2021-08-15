import { Request, Response } from 'express';
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
class RideController {
  constructor(private readonly rideService: RideService) {}

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

  async getRideById(req: Request, res: Response) {
    try {
      const rideId = Number(req.params.id);
      const ride = await this.rideService.getRideById(rideId);
      return res.json(ride);
    } catch (error) {
      return handleError(error, res);
    }
  }

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
