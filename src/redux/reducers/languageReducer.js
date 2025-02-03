import { createReducer } from 'reduxsauce';
import Types from '../actionTypes';

export const INITIAL_STATE = {
  fetching: false,
  error: null
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

export const importLanguageData = (state, action) => {
  return { ...state, data: action.data }
}

export const importLanguageFailure = (state) => {
  return { ...state, error: 'Importing Tags Data failed' }
}
/* ------------- Hookup Reducers To Types ------------- */

export const languageReducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_LANGUAGE_REQUEST]: request,
  [Types.FETCH_LANGUAGE_SUCCESS]: success,
  [Types.FETCH_LANGUAGE_FAILURE]: failure,
  [Types.IMPORT_LANGUAGE_DATA]: importLanguageData,
  [Types.IMPORT_LANGUAGE_FAILURE]: importLanguageFailure
});