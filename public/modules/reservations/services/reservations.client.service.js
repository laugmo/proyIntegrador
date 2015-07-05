'use strict';

//Reservations service used to communicate Reservations REST endpoints
angular.module('reservations').factory('Reservations', ['$resource',
	function($resource) {
		return $resource('reservations/:reservationId', { reservationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);