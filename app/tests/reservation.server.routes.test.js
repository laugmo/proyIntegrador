'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Reservation = mongoose.model('Reservation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, reservation;

/**
 * Reservation routes tests
 */
describe('Reservation CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Reservation
		user.save(function() {
			reservation = {
				name: 'Reservation Name'
			};

			done();
		});
	});

	it('should be able to save Reservation instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reservation
				agent.post('/reservations')
					.send(reservation)
					.expect(200)
					.end(function(reservationSaveErr, reservationSaveRes) {
						// Handle Reservation save error
						if (reservationSaveErr) done(reservationSaveErr);

						// Get a list of Reservations
						agent.get('/reservations')
							.end(function(reservationsGetErr, reservationsGetRes) {
								// Handle Reservation save error
								if (reservationsGetErr) done(reservationsGetErr);

								// Get Reservations list
								var reservations = reservationsGetRes.body;

								// Set assertions
								(reservations[0].user._id).should.equal(userId);
								(reservations[0].name).should.match('Reservation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Reservation instance if not logged in', function(done) {
		agent.post('/reservations')
			.send(reservation)
			.expect(401)
			.end(function(reservationSaveErr, reservationSaveRes) {
				// Call the assertion callback
				done(reservationSaveErr);
			});
	});

	it('should not be able to save Reservation instance if no name is provided', function(done) {
		// Invalidate name field
		reservation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reservation
				agent.post('/reservations')
					.send(reservation)
					.expect(400)
					.end(function(reservationSaveErr, reservationSaveRes) {
						// Set message assertion
						(reservationSaveRes.body.message).should.match('Please fill Reservation name');
						
						// Handle Reservation save error
						done(reservationSaveErr);
					});
			});
	});

	it('should be able to update Reservation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reservation
				agent.post('/reservations')
					.send(reservation)
					.expect(200)
					.end(function(reservationSaveErr, reservationSaveRes) {
						// Handle Reservation save error
						if (reservationSaveErr) done(reservationSaveErr);

						// Update Reservation name
						reservation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Reservation
						agent.put('/reservations/' + reservationSaveRes.body._id)
							.send(reservation)
							.expect(200)
							.end(function(reservationUpdateErr, reservationUpdateRes) {
								// Handle Reservation update error
								if (reservationUpdateErr) done(reservationUpdateErr);

								// Set assertions
								(reservationUpdateRes.body._id).should.equal(reservationSaveRes.body._id);
								(reservationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Reservations if not signed in', function(done) {
		// Create new Reservation model instance
		var reservationObj = new Reservation(reservation);

		// Save the Reservation
		reservationObj.save(function() {
			// Request Reservations
			request(app).get('/reservations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Reservation if not signed in', function(done) {
		// Create new Reservation model instance
		var reservationObj = new Reservation(reservation);

		// Save the Reservation
		reservationObj.save(function() {
			request(app).get('/reservations/' + reservationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', reservation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Reservation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reservation
				agent.post('/reservations')
					.send(reservation)
					.expect(200)
					.end(function(reservationSaveErr, reservationSaveRes) {
						// Handle Reservation save error
						if (reservationSaveErr) done(reservationSaveErr);

						// Delete existing Reservation
						agent.delete('/reservations/' + reservationSaveRes.body._id)
							.send(reservation)
							.expect(200)
							.end(function(reservationDeleteErr, reservationDeleteRes) {
								// Handle Reservation error error
								if (reservationDeleteErr) done(reservationDeleteErr);

								// Set assertions
								(reservationDeleteRes.body._id).should.equal(reservationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Reservation instance if not signed in', function(done) {
		// Set Reservation user 
		reservation.user = user;

		// Create new Reservation model instance
		var reservationObj = new Reservation(reservation);

		// Save the Reservation
		reservationObj.save(function() {
			// Try deleting Reservation
			request(app).delete('/reservations/' + reservationObj._id)
			.expect(401)
			.end(function(reservationDeleteErr, reservationDeleteRes) {
				// Set message assertion
				(reservationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Reservation error error
				done(reservationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Reservation.remove().exec();
		done();
	});
});