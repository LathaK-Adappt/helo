import { createReducer } from 'reduxsauce';
import Types from '../actionTypes';

export const INITIAL_STATE = {
    swipeArrayNodes: {}, 
    restrictionSwipe: {},
    isSwipeArrayReady: false
}

export const setSwipeArray = (state, action) => {
    return { ...state, ...action  }
}

/* ------------- Hookup Reducers To Types ------------- */

export const swipeArrayReducer = createReducer(INITIAL_STATE, {
    [Types.SET_SWIPE_ARRAY_NODES]: setSwipeArray
})