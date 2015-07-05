'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Reservation Schema
 */
var ReservationSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Ingrese un titulo o comentario',
		trim: true
	},
	type: {
		type: String,
		default: '',
		trim: true
	},
	startsAt: {
		type: Date,
		default: '',
		required: 'Seleccione el inicio de la cita',
		trim: true,
		unique: true
	},
	endsAt: {
		type: Date,
		required: 'Seleccione el fin de la cita',
		trim: true,
		unique: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Reservation', ReservationSchema);