import { LOADING_DATA, SET_SCREAMS, SET_SCREAM } from '../types';
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
