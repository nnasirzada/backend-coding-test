import { Service } from 'typedi';
import ApiError from '../model/api-error';
import Ride from '../model/ride';
import RideRepository from '../repository/ride-repository';
import Logger from '../logger/logger';

@Service()
class RideService {
  constructor(private readonly rideRepository: RideRepository) {}

  getAllRides(limit = 10, skip = 0): Promise<Ride[]> {
    return new Promise((res, rej) => {
      this.rideRepository
        .getAllRides(limit, skip)
        .then((rides) => {
          if (!rides || rides.length === 0) {
            return rej(new ApiError(ApiError.RIDES_NOT_FOUND_ERROR, 'Could not find any rides'));
          }
          return res(rides);
        })
        .catch((error) => RideService.handleError(error, rej));
    });
  }

  getRideById(rideId: number): Promise<Ride> {
    return new Promise((res, rej) => {
      this.rideRepository
        .getRideById(rideId)
        .then((ride) => {
          if (!ride) {
            return rej(new ApiError(ApiError.RIDES_NOT_FOUND_ERROR, `Could not find any ride matching rideId = ${rideId}`));
          }
          return res(ride);
        })
        .catch((error) => RideService.handleError(error, rej));
    });
  }

  createRide(ride: Ride): Promise<number> {
    return new Promise((res, rej) => {
      if (ride.start_lat < -90 || ride.start_lat > 90) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Start latitude must be between -90 - 90 degrees'));
      }

      if (ride.start_long < -180 || ride.start_long > 180) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Start longitude must be between -180 to 180 degrees'));
      }

      if (ride.end_lat < -90 || ride.end_lat > 90) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'End latitude must be between -90 - 90 degrees'));
      }

      if (ride.end_long < -180 || ride.end_long > 180) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'End longitude must be between -180 to 180 degrees'));
      }

      if (typeof ride.rider_name !== 'string' || !ride.rider_name || ride.rider_name?.length < 1) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Rider name must be a non empty string'));
      }

      if (typeof ride.driver_name !== 'string' || !ride.driver_name || ride.driver_name.length < 1) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Driver name must be a non empty string'));
      }

      if (typeof ride.driver_vehicle !== 'string' || !ride.driver_vehicle || ride.driver_vehicle.length < 1) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Driver vehicle must be a non empty string'));
      }

      this.rideRepository
        .createRide(ride)
        .then((rideId) => res(rideId))
        .catch((error) => RideService.handleError(error, rej));
    });
  }

  getRidesCount(): Promise<number> {
    return new Promise((res, rej) => {
      this.rideRepository
        .getRidesCount()
        .then((ridesCount) => res(ridesCount))
        .catch((error) => rej(error));
    });
  }

  private static handleError(error: Error | ApiError, reject: any) {
    Logger.error(error);
    return reject(new ApiError(ApiError.SERVER_ERROR, 'Unknown Error'));
  }
}

export default RideService;
