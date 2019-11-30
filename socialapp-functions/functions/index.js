const functions = require('firebase-functions');

const express = require('express');
const FBAuth = require('./middleware/fbAuth');
const app = express();

const {
	getAllScreams,
	postOneScream,
	getScream,
	commentOnScream,
	likeScream,
	unlikeScream,
	deleteScream
} = require('./handlers/screams');
const {
	signup,
	login,
	uploadImage,
	getAuthenticatedUser,
	addUserDetails
} = require('./handlers/users');

//Get All Screams
app.get('/screams', getAllScreams);
//Create scream
app.post('/scream', FBAuth, postOneScream);
//Create User
app.post('/signup', signup);
//Login User
app.post('/login', login);
//Upload Image
app.post('/user/image', FBAuth, uploadImage);
// Add User Details
app.post('/user', FBAuth, addUserDetails);
// Get signedIn/Authenticated user
app.get('/user', FBAuth, getAuthenticatedUser);
//Get Single Scream Details
app.get('/scream/:screamId', getScream);
//Add Comment to scream
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
//Like A Scream
app.get('/scream/:screamId/like', FBAuth, likeScream);
//Unlike A Scream
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
//Delete Scream
app.delete('/scream/:screamId', FBAuth, deleteScream);

exports.api = functions.https.onRequest(app);
