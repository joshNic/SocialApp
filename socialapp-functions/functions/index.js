const functions = require('firebase-functions');

const express = require('express');
const FBAuth = require('./middleware/fbAuth');
const app = express();

const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login, uploadImage } = require('./handlers/users');

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

exports.api = functions.https.onRequest(app);
