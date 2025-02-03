import { createReducer } from 'reduxsauce';
import Types from '../actionTypes';

export const INITIAL_STATE = {
  fetching: false,
  error: null,
  data: {}
}

export const request = (state) => {
  return { ...state, fetching: true }
}

export const success = (state, action) => {
  return { ...state, fetching: false, error: null }
}

export const failure = (state, { error }) => {
  return { ...state, fetching: false, error }
}

export const importCarouselData = (state, action) => {
  return { ...state, data: action.data }
}

export const importCarouselFailure = (state, action) => {
  return { ...state, error: action.err }
}
/* ------------- Hookup Reducers To Types ------------- */

export const carouselReducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_CAROUSEL_REQUEST]: request,
  [Types.FETCH_CAROUSEL_SUCCESS]: success,
  [Types.FETCH_CAROUSEL_FAILURE]: failure,
  [Types.IMPORT_CAROUSEL_DATA]: importCarouselData,
  [Types.IMPORT_CAROUSEL_FAILURE]: importCarouselFailure
});