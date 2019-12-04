const functions = require('firebase-functions');

const express = require('express');
const FBAuth = require('./middleware/fbAuth');
const app = express();

const { db } = require('./utils/admin');

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
	addUserDetails,
	getUserDetails,
	markNotificationsRead
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
//Get User Details
app.get('/user/:handle', getUserDetails);
//Read Notifications
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

//Notification on a like
exports.createNotificationOnLike = functions.firestore
	.document('likes/{id}')
	.onCreate(snapshot => {
		return (
			db
				.doc(`/screams/${snapshot.data().screamId}`)
				.get()
				.then(doc => {
					if (
						doc.exists &&
						doc.data().userHandle !== snapshot.data().userHandle
					) {
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
				// .then(() => {
				// 	return;
				// })
				.catch(err => {
					console.error(err);
				})
		);
	});

//Notification on a unlike
exports.deleteNotificationOnUnLike = functions.firestore
	.document('likes/{id}')
	.onDelete(snapshot => {
		return (
			db
				.doc(`/notifications/${snapshot.id}`)
				.delete()
				// .then(() => {
				// 	return;
				// })
				.catch(err => {
					console.error(err);
					// return;
				})
		);
	});

//Notification on a comment

exports.createNotificationOnComment = functions.firestore
	.document('comments/{id}')
	.onCreate(snapshot => {
		return (
			db
				.doc(`/screams/${snapshot.data().screamId}`)
				.get()
				.then(doc => {
					if (
						doc.exists &&
						doc.data().userHandle !== snapshot.data().userHandle
					) {
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
				// .then(() => {
				// 	return;
				// })
				.catch(err => {
					console.error(err);
					// return;
				})
		);
	});

//Notification on user chnage image
exports.onUserImageChange = functions.firestore
	.document('/users/{userId}')
	.onUpdate(change => {
		// console.log(change.before.data());
		// console.log(change.after.data());
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			let batch = db.batch();
			return db
				.collection('screams')
				.where('userHandle', '==', change.before.data().handle)
				.get()
				.then(data => {
					data.forEach(doc => {
						const scream = db.doc(`/screams/${doc.id}`);
						batch.update(scream, {
							userImage: change.after.data().imageUrl
						});
					});
					return batch.commit();
				});
		} else return true;
	});

//Notification on scream deleted
exports.onScreamDelete = functions.firestore
	.document('/screams/{screamId}')
	.onDelete((snapshot, context) => {
		const screamId = context.params.screamId;
		const batch = db.batch();
		return db
			.collection('comments')
			.where('screamId', '==', screamId)
			.get()
			.then(data => {
				data.forEach(doc => {
					batch.delete(db.doc(`/comments/${doc.id}`));
				});
				return db
					.collection('likes')
					.where('screamId', '==', screamId)
					.get();
			})
			.then(data => {
				data.forEach(doc => {
					batch.delete(db.doc(`/likes/${doc.id}`));
				});
				return db
					.collection('notifications')
					.where('screamId', '==', screamId)
					.get();
			})
			.then(data => {
				data.forEach(doc => {
					batch.delete(db.doc(`/notifications/${doc.id}`));
				});
				return batch.commit();
			})
			.catch(err => {
				console.error(err);
			});
	});
