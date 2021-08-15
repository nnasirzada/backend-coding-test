import { Database } from 'sqlite3';
import { Service } from 'typedi';
import Ride from '../model/ride';

@Service()
class RideRepository {
  constructor(private readonly db: Database) {}

  getAllRides(limit = 10, skip = 0): Promise<Ride[]> {
    return new Promise((res, rej) => {
      this.db.all('SELECT * FROM Rides ORDER BY rideID DESC LIMIT ? OFFSET ?', [limit, skip], (err: Error, rides: Ride[]) => {
        if (err) {
          return rej(err);
        }
        return res(rides);
      });
    });
  }

  getRideById(rideId: number): Promise<Ride> {
    return new Promise((res, rej) => {
      this.db.get('SELECT * FROM Rides WHERE rideId = ?', rideId, (err: Error, ride: Ride) => {
        if (err) {
          return rej(err);
        }
        return res(ride);
      });
    });
  }

  createRide(ride: Ride): Promise<number> {
    return new Promise((res, rej) => {
      const values = [
        ride.startLat,
        ride.startLong,
        ride.endLat,
        ride.endLong,
        ride.riderName,
        ride.driverName,
        ride.driverVehicle,
      ];
      this.db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err: Error) {
        if (err) {
          return rej(err);
        }
        return res(this.lastID);
      });
    });
  }

  getRidesCount(): Promise<number> {
    return new Promise((res, rej) => {
      this.db.get('SELECT COUNT(rideID) as ridesCount FROM Rides', (err: Error, result: any) => {
        if (err) {
          return rej(err);
        }
        return res(result.ridesCount);
      });
    });
  }
}

export default RideRepository;
