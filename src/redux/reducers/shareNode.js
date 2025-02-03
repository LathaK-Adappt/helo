import * as types from '../actionTypes'

export default function (state={ url: null }, action) {
	switch (action.type) {
		case types.SET_SHARED_CONTENT_NODE:
			return {
				...state,
				url: action.url,
			};
		default:
			return state;
	}
}