'use strict';

// Configuring the Articles module
angular.module('reservations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Reservations', 'reservations', 'dropdown', '/reservations(/create)?');
		Menus.addSubMenuItem('topbar', 'reservations', 'List Reservations', 'reservations');
		Menus.addSubMenuItem('topbar', 'reservations', 'New Reservation', 'reservations/create');
	}
]);