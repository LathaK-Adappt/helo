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

export const importTagsData = (state, action) => {
  return { ...state, data: action.data }
}

export const importTagsFailure = (state, action) => {
  return { ...state, error: action.err }
}
/* ------------- Hookup Reducers To Types ------------- */

export const tagsReducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_TAGS_REQUEST]: request,
  [Types.FETCH_TAGS_SUCCESS]: success,
  [Types.FETCH_TAGS_FAILURE]: failure,
  [Types.IMPORT_TAGS_DATA]: importTagsData,
  [Types.IMPORT_TAGS_FAILURE]: importTagsFailure
});