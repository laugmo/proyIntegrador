'use strict';

(function() {
	// Reservations Controller Spec
	describe('Reservations Controller Tests', function() {
		// Initialize global variables
		var ReservationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Reservations controller.
			ReservationsController = $controller('ReservationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Reservation object fetched from XHR', inject(function(Reservations) {
			// Create sample Reservation using the Reservations service
			var sampleReservation = new Reservations({
				name: 'New Reservation'
			});

			// Create a sample Reservations array that includes the new Reservation
			var sampleReservations = [sampleReservation];

			// Set GET response
			$httpBackend.expectGET('reservations').respond(sampleReservations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reservations).toEqualData(sampleReservations);
		}));

		it('$scope.findOne() should create an array with one Reservation object fetched from XHR using a reservationId URL parameter', inject(function(Reservations) {
			// Define a sample Reservation object
			var sampleReservation = new Reservations({
				name: 'New Reservation'
			});

			// Set the URL parameter
			$stateParams.reservationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/reservations\/([0-9a-fA-F]{24})$/).respond(sampleReservation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reservation).toEqualData(sampleReservation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Reservations) {
			// Create a sample Reservation object
			var sampleReservationPostData = new Reservations({
				name: 'New Reservation'
			});

			// Create a sample Reservation response
			var sampleReservationResponse = new Reservations({
				_id: '525cf20451979dea2c000001',
				name: 'New Reservation'
			});

			// Fixture mock form input values
			scope.name = 'New Reservation';

			// Set POST response
			$httpBackend.expectPOST('reservations', sampleReservationPostData).respond(sampleReservationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Reservation was created
			expect($location.path()).toBe('/reservations/' + sampleReservationResponse._id);
		}));

		it('$scope.update() should update a valid Reservation', inject(function(Reservations) {
			// Define a sample Reservation put data
			var sampleReservationPutData = new Reservations({
				_id: '525cf20451979dea2c000001',
				name: 'New Reservation'
			});

			// Mock Reservation in scope
			scope.reservation = sampleReservationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/reservations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/reservations/' + sampleReservationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid reservationId and remove the Reservation from the scope', inject(function(Reservations) {
			// Create new Reservation object
			var sampleReservation = new Reservations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Reservations array and include the Reservation
			scope.reservations = [sampleReservation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/reservations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReservation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.reservations.length).toBe(0);
		}));
	});
}());