import { Service } from 'typedi';
import ApiError from '../model/api-error';
import Ride from '../model/ride';
import RideRepository from '../repository/ride-repository';
import Logger from '../logger/logger';

function handleError(error: Error | ApiError, reject: any) {
  Logger.error(error);
  return reject(new ApiError(ApiError.SERVER_ERROR, 'Unknown Error'));
}

@Service()
class RideService {
  constructor(private readonly rideRepository: RideRepository) {}

  getAllRides(): Promise<Ride[]> {
    return new Promise((res, rej) => {
      this.rideRepository
        .getAllRides()
        .then((rides) => {
          if (!rides || rides.length === 0) {
            return rej(new ApiError(ApiError.RIDES_NOT_FOUND_ERROR, 'Could not find any rides'));
          }
          return res(rides);
        })
        .catch((error) => handleError(error, rej));
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
        .catch((error) => handleError(error, rej));
    });
  }

  createRide(ride: Ride): Promise<number> {
    return new Promise((res, rej) => {
      if (ride.startLat < -90 || ride.startLat > 90) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Start latitude must be between -90 - 90 degrees'));
      }

      if (ride.startLong < -180 || ride.startLong > 180) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Start longitude must be between -180 to 180 degrees'));
      }

      if (ride.endLat < -90 || ride.endLat > 90) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'End latitude must be between -90 - 90 degrees'));
      }

      if (ride.endLong < -180 || ride.endLong > 180) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'End longitude must be between -180 to 180 degrees'));
      }

      if (typeof ride.riderName !== 'string' || !ride.riderName || ride.riderName?.length < 1) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Rider name must be a non empty string'));
      }

      if (typeof ride.driverName !== 'string' || !ride.driverName || ride.driverName.length < 1) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Driver name must be a non empty string'));
      }

      if (typeof ride.driverVehicle !== 'string' || !ride.driverVehicle || ride.driverVehicle.length < 1) {
        return rej(new ApiError(ApiError.VALIDATION_ERROR, 'Driver vehicle must be a non empty string'));
      }

      this.rideRepository
        .createRide(ride)
        .then((rideId) => res(rideId))
        .catch((error) => handleError(error, rej));
    });
  }
}

export default RideService;
