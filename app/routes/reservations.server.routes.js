'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var reservations = require('../../app/controllers/reservations.server.controller');

	// Reservations Routes
	app.route('/reservations')
		.get(reservations.list)
		.post(users.requiresLogin, reservations.create);

	app.route('/reservations/:reservationId')
		.get(reservations.read)
		.put(users.requiresLogin, reservations.hasAuthorization, reservations.update)
		.delete(users.requiresLogin, reservations.hasAuthorization, reservations.delete);

	// Finish by binding the Reservation middleware
	app.param('reservationId', reservations.reservationByID);
};
