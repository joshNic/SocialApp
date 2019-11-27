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

//TODO: Create Firebase Authentication Middleware
const FBAuth = (req, res, next) => {
	let idToken;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		idToken - req.headers.authorization.split('Bearer ')[1];
	} else {
		console.error('No token found');
		return res.status(403).json({ error: 'Unauthorized' });
	}
	admin
		.auth()
		.verifyIdToken(idToken)
		.then(decodedToken => {
			req.user = decodedToken;
			console.log(decodedToken);
			return db
				.collection('users')
				.where('userId', '==', req.user.uid)
				.limit(1)
				.get();
		})
		.then(data => {
			req.user.handle = data.docs[0].data().handle;
			return next();
		})
		.catch(err => {
			console.error('Error while verifying token', err);
			return res.status(403).json(err);
		});
};

//Create scream
app.post('/scream', FBAuth, (req, res) => {
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

//TODO: Add Helper functions to be moved to another file later
const isEmail = email => {
	const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	if (email.match(regEx)) {
		return true;
	} else {
		return false;
	}
};

const isEmpty = entry => {
	if (entry.trim() === '') {
		return true;
	} else {
		return false;
	}
};

//Create User
app.post('/signup', (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle
	};

	let errors = {};

	if (isEmpty(newUser.email)) {
		errors.email = 'Must not be empty';
	} else if (!isEmail(newUser.email)) {
		errors.email = 'Must be a valid email address';
	}

	if (isEmpty(newUser.password)) errors.password = 'Must not be empty';
	if (newUser.password !== newUser.confirmPassword)
		errors.confirmPassword = 'Passwords must match';
	if (isEmpty(newUser.handle)) errors.handle = 'Must not be empty';
	if (Object.keys(errors).length > 0) return res.status(400).json(errors);

	// TODO: validate data
	let token, userId;
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
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then(idToken => {
			token = idToken;
			const userCredentials = {
				handle: newUser.handle,
				email: newUser.email,
				createdAt: new Date().toISOString(),
				userId
			};
			return db.doc(`/users/${newUser.handle}`).set(userCredentials);
		})
		.then(() => {
			return res.status(201).json({ token });
		})
		.catch(err => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return res
					.status(400)
					.json({ email: 'Email is already in use' });
			} else {
				return res.status(500).json({ error: err.code });
			}
		});
});

//TODO: Add login Route
app.post('/login', (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password
	};

	let errors = {};

	if (isEmpty(user.email)) errors.email = 'Must not be empty';
	if (isEmpty(user.password)) errors.password = 'Must not be empty';
	if (Object.keys(errors).length > 0) return res.status(400).json(errors);

	firebase
		.auth()
		.signInWithEmailAndPassword(user.email, user.password)
		.then(data => {
			return data.user.getIdToken();
		})
		.then(token => {
			return res.json({ token });
		})
		.catch(err => {
			console.error(err);
			if (err.code === 'auth/wrong-password') {
				return res
					.status(403)
					.json({ general: 'Wrong credentials, please try again' });
			} else {
				return res.status(500).json({ error: err.code });
			}
		});
});
exports.api = functions.https.onRequest(app);
