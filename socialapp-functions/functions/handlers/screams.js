const { db } = require('../utils/admin');

//Get all Screams
exports.getAllScreams = (req, res) => {
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
};

//Create Scream

exports.postOneScream = (req, res) => {
	if (req.method !== 'POST') {
		return res.status(400).json({ error: 'Method Not Allowed' });
	}
	const newScream = {
		body: req.body.body,
		userHandle: req.user.handle,
		// commentCount: req.body.commentCount,
		// likeCount: req.body.likeCount,
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
};
