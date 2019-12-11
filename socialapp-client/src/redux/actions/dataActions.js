import {
	LOADING_DATA,
	SET_SCREAMS,
	LIKE_SCREAM,
	UNLIKE_SCREAM,
	DELETE_SCREAM,
	POST_SCREAM,
	SET_ERRORS,
	LOADING_UI,
	CLEAR_ERRORS
} from '../types';
import axios from 'axios';

//Get all screams
export const getScreams = () => dispatch => {
	dispatch({ type: LOADING_DATA });
	axios
		.get('/screams')
		.then(res => {
			dispatch({
				type: SET_SCREAMS,
				payload: res.data
			});
		})
		.catch(err => {
			dispatch({
				type: SET_SCREAMS,
				payload: []
			});
		});
};

//Like a scream
export const likeScream = screamId => dispatch => {
	axios
		.get(`/scream/${screamId}/like`)
		.then(res => {
			dispatch({
				type: LIKE_SCREAM,
				payload: res.data
			});
		})
		.catch(err => console.log(err));
};

//Unlike a Scream
export const unLikeScream = screamId => dispatch => {
	axios
		.get(`/scream/${screamId}/unlike`)
		.then(res => {
			dispatch({
				type: UNLIKE_SCREAM,
				payload: res.data
			});
		})
		.catch(err => console.log(err));
};

export const deleteScream = screamId => dispatch => {
	axios
		.delete(`/scream/${screamId}`)
		.then(() => {
			dispatch({ type: DELETE_SCREAM, payload: screamId });
		})
		.catch(err => console.log(err));
};

export const postScream = newScream => dispatch => {
	dispatch({ type: LOADING_UI });
	axios
		.post('/scream', newScream)
		.then(res => {
			dispatch({
				type: POST_SCREAM,
				payload: res.data
			});
			dispatch(clearErrors());
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data
			});
		});
};

export const clearErrors = () => dispatch => {
	dispatch({ type: CLEAR_ERRORS });
};
