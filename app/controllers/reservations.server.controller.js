'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Reservation = mongoose.model('Reservation'),
	_ = require('lodash');

/**
 * Create a Reservation
 */
exports.create = function(req, res) {
	var reservation = new Reservation(req.body);
	reservation.user = req.user;

	reservation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reservation);
		}
	});
};

/**
 * Show the current Reservation
 */
exports.read = function(req, res) {
	res.jsonp(req.reservation);
};

/**
 * Update a Reservation
 */
exports.update = function(req, res) {
	var reservation = req.reservation ;

	reservation = _.extend(reservation , req.body);

	reservation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reservation);
		}
	});
};

/**
 * Delete an Reservation
 */
exports.delete = function(req, res) {
	var reservation = req.reservation ;

	reservation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reservation);
		}
	});
};

/**
 * List of Reservations
 */
exports.list = function(req, res) { 
	Reservation.find().sort('-created').populate('user', 'displayName').exec(function(err, reservations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reservations);
		}
	});
};

/**
 * Reservation middleware
 */
exports.reservationByID = function(req, res, next, id) { 
	Reservation.findById(id).populate('user', 'displayName').exec(function(err, reservation) {
		if (err) return next(err);
		if (! reservation) return next(new Error('Failed to load Reservation ' + id));
		req.reservation = reservation ;
		next();
	});
};

/**
 * Reservation authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.reservation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
