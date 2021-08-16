import 'mocha';
import { describe } from "mocha";
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';
import Ride from '../../src/model/ride';
import { expect } from 'chai';
import RideService from '../../src/service/ride-service';
import RideRepository from '../../src/repository/ride-repository';

let rideService: RideService;
let mockedRideRepository: RideRepository;
let mockedRideRepositoryInstance: RideRepository;
let mockRides: Ride[];

describe('Ride Service tests', () => {
    before((done) => {
        mockedRideRepository = mock(RideRepository);
        mockedRideRepositoryInstance = instance(mockedRideRepository);
        mockRides = [5,4,3,2,1].map(id => new Ride(id, 50, 60, 70, 80, "Nazar", "John", "Prius", "2021-08-15 20:20:25"));
        when(mockedRideRepository.getAllRides(5, 0)).thenReturn(Promise.resolve(mockRides));
        when(mockedRideRepository.getAllRides(10, 0)).thenReturn(Promise.resolve([]));
        when(mockedRideRepository.getRideById(6)).thenReturn(Promise.resolve(null));
        when(mockedRideRepository.getRideById(1)).thenReturn(Promise.resolve(mockRides[4]));
        when(mockedRideRepository.createRide(anyOfClass(Ride))).thenReturn(Promise.resolve(1));
        when(mockedRideRepository.getRidesCount()).thenReturn(Promise.resolve(mockRides.length));
        rideService = new RideService(mockedRideRepositoryInstance);
        done();
    });

    it('should throw RIDES_NOT_FOUND_ERROR when getAllRides called', async () => {
        try {
            await rideService.getAllRides(10, 0);
        } catch (error) {
            verify(mockedRideRepository.getAllRides(10, 0)).once();
            expect(error).has.property("error_code");
            expect(error).has.property("error_message");
            expect(error.error_code).equals("RIDES_NOT_FOUND_ERROR");
            expect(error.error_message).equals("Could not find any rides");
        }
    });

    it('should return list of all rides when getAllRides called', async () => {
        const rides = await rideService.getAllRides(5, 0);
        verify(mockedRideRepository.getAllRides(5, 0)).once();
        expect(rides).deep.equal(mockRides);
    });

    it('should return a ride when getRideById called', async () => {
        const ride = await rideService.getRideById(1);
        verify(mockedRideRepository.getRideById(1)).once();
        expect(ride).equal(mockRides[4]);
    });

    it('should throw RIDES_NOT_FOUND_ERROR when getRideById called', async () => {
        try {
            await rideService.getRideById(6);
        } catch (error) {
            verify(mockedRideRepository.getRideById(6)).once();
            expect(error).has.property("error_code");
            expect(error).has.property("error_message");
            expect(error.error_code).equals("RIDES_NOT_FOUND_ERROR");
            expect(error.error_message).equals("Could not find any ride matching rideId = 6");
        }
    });

    it('should create a ride and return ID of created ride when createRide called', async () => {
        const rideToCreate = new Ride(
            undefined, 10, 20, 30, 40, "Nazar", "John", "Toyota Camry", undefined
        );
        const createdRideId = await rideService.createRide(rideToCreate);
        verify(mockedRideRepository.createRide(rideToCreate)).once();
        expect(createdRideId).equal(1);
    });

    it('should return count of rides when getRidesCount called', async () => {
        const ridesCount = await rideService.getRidesCount();
        verify(mockedRideRepository.getRidesCount()).once();
        expect(ridesCount).equals(5);
    });
});