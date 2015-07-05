'use strict';

//Setting up route
angular.module('reservations').config(['$stateProvider',
	function($stateProvider) {
		// Reservations state routing
		$stateProvider.
		state('listReservations', {
			url: '/reservations',
			templateUrl: 'modules/reservations/views/list-reservations.client.view.html'
		}).
		state('createReservation', {
			url: '/reservations/create',
			templateUrl: 'modules/reservations/views/create-reservation.client.view.html'
		}).
		state('viewReservation', {
			url: '/reservations/:reservationId',
			templateUrl: 'modules/reservations/views/view-reservation.client.view.html'
		}).
		state('editReservation', {
			url: '/reservations/:reservationId/edit',
			templateUrl: 'modules/reservations/views/edit-reservation.client.view.html'
		});
	}
]);