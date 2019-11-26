const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const firebase = require('firebase');
const config = require('./constants');

const app = express();
admin.initializeApp();
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/screams', (req, res) => {
	db.collection('screams')
		.orderBy('createdAt', 'desc')
		.get()
		.then(data => {
			let screams = [];
			data.forEach(doc => {
				screams.push({ screamId: doc.id, ...doc.data() });
			});
			return res.json(screams);
		})
		.catch(err => console.error(err));
});

//Create scream
app.post('/scream', (req, res) => {
	if (req.method !== 'POST') {
		return res.status(400).json({ error: 'Method Not Allowed' });
	}
	const newScream = {
		body: req.body.body,
		userHandle: req.body.userHandle,
		commentCount: req.body.commentCount,
		likeCount: req.body.likeCount,
		createdAt: new Date().toISOString()
	};
	db.collection('screams')
		.add(newScream)
		.then(doc => {
			res.json({ message: `document ${doc.id} created successfully` });
		})
		.catch(err => {
			res.status(500).json({ error: 'something went wrong' });
			console.error(err);
		});
});

//Create User
app.post('/signup', (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle
	};

	// TODO: validate data
	db.doc(`/users/${newUser.handle}`)
		.get()
		.then(doc => {
			if (doc.exists) {
				return res
					.status(400)
					.json({ handle: 'this handle is already taken' });
			} else {
				return firebase
					.auth()
					.createUserWithEmailAndPassword(
						newUser.email,
						newUser.password
					);
			}
		})
		.then(data => {
			return data.user.getIdToken();
		})
		.then(token => {
			return res.status(201).json({ token });
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
});

// 	firebase
// 		.auth()
// 		.createUserWithEmailAndPassword(newUser.email, newUser.password)
// 		.then(data => {
// 			return res.status(201).json({
// 				message: `user ${data.user.uid} signed up successfully`
// 			});
// 		})
// 		.catch(err => {
// 			console.error(err);
// 			return res.status(500).json({ error: err.code });
// 		});
// });

exports.api = functions.https.onRequest(app);
