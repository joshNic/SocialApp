import {
	SET_ERRORS,
	CLEAR_ERRORS,
	LOADING_UI,
	SET_USER,
	LOADING_USER
} from '../types';
import axios from 'axios';

//Login User
export const loginUser = (userData, history) => dispatch => {
	dispatch({ type: LOADING_UI });
	axios
		.post('/login', userData)
		.then(res => {
			const FBIdToken = `Bearer ${res.data.token}`;
			localStorage.setItem('FBIdToken', FBIdToken);
			axios.defaults.headers.common['Authorization'] = FBIdToken;
			dispatch(getUserData());
			dispatch({ type: CLEAR_ERRORS });
			history.push('/');
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data
			});
		});
};

//Signup User
export const signupUser = (newUserData, history) => dispatch => {
	dispatch({ type: LOADING_UI });
	axios
		.post('/signup', userData)
		.then(res => {
			const FBIdToken = `Bearer ${res.data.token}`;
			localStorage.setItem('FBIdToken', FBIdToken);
			axios.defaults.headers.common['Authorization'] = FBIdToken;
			dispatch(getUserData());
			dispatch({ type: CLEAR_ERRORS });
			history.push('/');
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data
			});
		});
};

export const getUserData = () => dispatch => {
	dispatch({ type: LOADING_USER });
	axios
		.get('/user')
		.then(res => {
			dispatch({
				type: SET_USER,
				payload: res.data
			});
		})
		.catch(err => console.log(err));
};
