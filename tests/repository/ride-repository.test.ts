import 'mocha';
import { describe } from "mocha";
import { anyNumber, anyOfClass, instance, mock, verify, when } from 'ts-mockito';
import RideRepository from '../../src/repository/ride-repository';
import Ride from '../../src/model/ride';
import { expect } from 'chai';

let mockedRideRepository: RideRepository;
let mockedRideRepositoryInstance: RideRepository;
let mockRides: Ride[];

describe('Ride Repository tests', () => {
    before((done) => {
        mockedRideRepository = mock(RideRepository);
        mockedRideRepositoryInstance = instance(mockedRideRepository);
        mockRides = [5,4,3,2,1].map(id => new Ride(id, 50, 60, 70, 80, "Nazar", "John", "Prius", "2021-08-15 20:20:25"));
        when(mockedRideRepository.getAllRides(anyNumber(), anyNumber())).thenReturn(Promise.resolve(mockRides));
        when(mockedRideRepository.getRideById(5)).thenReturn(Promise.resolve(mockRides[0]));
        when(mockedRideRepository.createRide(anyOfClass(Ride))).thenReturn(Promise.resolve(1));
        when(mockedRideRepository.getRidesCount()).thenReturn(Promise.resolve(mockRides.length));
        done();
    });

    it('should return list of all rides when getAllRides called', async () => {
        const rides = await mockedRideRepositoryInstance.getAllRides(10, 0);
        verify(mockedRideRepository.getAllRides(10, 0)).once();
        expect(rides).deep.equal(mockRides);
    });

    it('should return a ride when getRideById called', async () => {
        const ride = await mockedRideRepositoryInstance.getRideById(5);
        verify(mockedRideRepository.getRideById(5)).once();
        expect(ride).equal(mockRides[0]);
    });

    it('should create a ride and return ID of created ride when createRide called', async () => {
        const rideToCreate = new Ride(
            undefined, 10, 20, 30, 40, "Nazar", "John", "Toyota Camry", undefined
        );
        const createdRideId = await mockedRideRepositoryInstance.createRide(rideToCreate);
        verify(mockedRideRepository.createRide(rideToCreate)).once();
        expect(createdRideId).equal(1);
    });

    it('should return count of rides when getRidesCount called', async () => {
        const ridesCount = await mockedRideRepositoryInstance.getRidesCount();
        verify(mockedRideRepository.getRidesCount()).once();
        expect(ridesCount).equal(5);
    });
});