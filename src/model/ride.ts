import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Represents a ride',
  name: 'Ride',
})
export default class Ride {
  @ApiModelProperty({
    description: 'ID of ride',
    required: false,
    example: 1,
  })
  ride_ID: number;

  @ApiModelProperty({
    description: 'Start latitude of ride. Should be between -90 and 90.',
    required: true,
    example: 50,
  })
  start_lat: number;

  @ApiModelProperty({
    description: 'Start longtitude of ride. Should be between -180 and 180.',
    required: true,
    example: 100,
  })
  start_long: number;

  @ApiModelProperty({
    description: 'End latitude of ride. Should be between -90 and 90.',
    required: true,
    example: 60,
  })
  end_lat: number;

  @ApiModelProperty({
    description: 'End longtitude of ride. Should be between -180 and 180.',
    required: true,
    example: 120,
  })
  end_long: number;

  @ApiModelProperty({
    description: 'Name of rider',
    required: true,
    example: 'Nazar',
  })
  rider_name: string;

  @ApiModelProperty({
    description: 'Name of driver',
    required: true,
    example: 'John',
  })
  driver_name: string;

  @ApiModelProperty({
    description: 'Name of vehicle of driver',
    required: true,
    example: 'Toyota Prius',
  })
  driver_vehicle: string;

  @ApiModelProperty({
    description: 'Creation datetime of ride',
    required: false,
    example: '2021-08-15 20:20:25',
  })
  created: string | null;

  constructor(
    ride_ID: number,
    start_lat: number,
    start_long: number,
    end_lat: number,
    end_long: number,
    rider_name: string,
    driver_name: string,
    driver_vehicle: string,
    created: string | null,
  ) {
    this.ride_ID = ride_ID;
    this.start_lat = start_lat;
    this.start_long = start_long;
    this.end_lat = end_lat;
    this.end_long = end_long;
    this.rider_name = rider_name;
    this.driver_name = driver_name;
    this.driver_vehicle = driver_vehicle;
    this.created = created;
  }
}
