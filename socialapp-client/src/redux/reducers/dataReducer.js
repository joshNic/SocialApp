import {
	SET_SCREAMS,
	LIKE_SCREAM,
	UNLIKE_SCREAM,
	LOADING_DATA
} from '../types';

const initialState = {
	screams: [],
	screams: {},
	loading: false
};

export default function(state = initialState, actions) {
	switch (actions.type) {
		case LOADING_DATA:
			return {
				...state,
				loading: true
			};
		case SET_SCREAMS:
			return {
				...state,
				screams: actions.payload,
				loading: false
			};
		default:
			return state;
	}
}
