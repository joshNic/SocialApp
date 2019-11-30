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

//Notification on a like
exports.createNotificationOnLike = functions.firestore
	.document('likes/{id}')
	.onCreate(snapshot => {
		db.doc(`/screams/${snapshot.data().screamId}`)
			.get()
			.then(doc => {
				if (doc.exists) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'like',
						read: false,
						screamId: doc.id
					});
				}
			})
			.then(() => {
				return;
			})
			.catch(err => {
				console.error(err);
				return;
			});
	});

//Notification on a unlike
exports.deleteNotificationOnUnLike = functions.firestore
	.document('likes/{id}')
	.onDelete(snapshot => {
		db.doc(`/notifications/${snapshot.id}`)
			.delete()
			.then(() => {
				return;
			})
			.catch(err => {
				console.error(err);
				return;
			});
	});

//Notification on a comment

exports.createNotificationOnComment = functions.firestore
	.document('comments/{id}')
	.onCreate(snapshot => {
		db.doc(`/screams/${snapshot.data().screamId}`)
			.get()
			.then(doc => {
				if (doc.exists) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'comment',
						read: false,
						screamId: doc.id
					});
				}
			})
			.then(() => {
				return;
			})
			.catch(err => {
				console.error(err);
				return;
			});
	});
