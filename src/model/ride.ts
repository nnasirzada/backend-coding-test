export default class Ride {
  constructor(
    public readonly rideId: number,
    public readonly startLat: number,
    public readonly startLong: number,
    public readonly endLat: number,
    public readonly endLong: number,
    public readonly riderName: string,
    public readonly driverName: string,
    public readonly driverVehicle: string,
    public readonly created: string | null,
  ) {}
}
