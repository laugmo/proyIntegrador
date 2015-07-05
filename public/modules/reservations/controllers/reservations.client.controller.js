'use strict';

// Reservations controller
angular.module('reservations').controller('ReservationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reservations',
	function($scope, $stateParams, $location, Authentication, Reservations) {
		$scope.authentication = Authentication;

		// Create new Reservation
		$scope.create = function() {
			// Create new Reservation object
			var reservation = new Reservations ({
				name: this.name
			});

			// Redirect after save
			reservation.$save(function(response) {
				$location.path('reservations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Reservation
		$scope.remove = function(reservation) {
			if ( reservation ) { 
				reservation.$remove();

				for (var i in $scope.reservations) {
					if ($scope.reservations [i] === reservation) {
						$scope.reservations.splice(i, 1);
					}
				}
			} else {
				$scope.reservation.$remove(function() {
					$location.path('reservations');
				});
			}
		};

		// Update existing Reservation
		$scope.update = function() {
			var reservation = $scope.reservation;

			reservation.$update(function() {
				$location.path('reservations/' + reservation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reservations
		$scope.find = function() {
			$scope.reservations = Reservations.query();
		};

		// Find existing Reservation
		$scope.findOne = function() {
			$scope.reservation = Reservations.get({ 
				reservationId: $stateParams.reservationId
			});
		};
	}
]);