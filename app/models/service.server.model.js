'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Service Schema
 */
var ServiceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Por favor, ingrese el nombre del servicio.',
		trim: true
	},
	duration: {
		type: Number,
		default: '',
		required: 'Por favor, ingrese un tiempo estimado.',
		trim: true
	},
	price: {
		type: Number,
		default: '',
		required: 'Por favor, ingrese el costo del servicio.',
		trim: true
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

mongoose.model('Service', ServiceSchema);