import { createReducer } from 'reduxsauce';
import Types from '../actionTypes';

export const INITIAL_STATE = []

export const addFavourite = (state, action) => {
  return [action.data, ...state]
}
export const removeFavourite = (state, action) => {
  return state.filter(d => d.nid !== action.data.nid)
}
/* ------------- Hookup Reducers To Types ------------- */

export const favouriteReducer = createReducer(INITIAL_STATE, {
  [Types.ADD_FAVOURITE]: addFavourite,
  [Types.REMOVE_FAVOURITE]: removeFavourite
})