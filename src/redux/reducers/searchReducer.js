import { createReducer } from 'reduxsauce';
import Types from '../actionTypes';

export const INITIAL_STATE = {
  fetching: false,
  error: null,
  searchData: [],
  searchList: []
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

export const importSearchData = (state, action) => {
  return { ...state, searchData: action.data }
}

export const importSearchFailure = (state) => {
  return { ...state, error: 'Importing Search Data failed' }
}

export const reqSearchList = (state, action) => {
  return { ...state }
}

export const setSearchList = (state, action) => {
  return { ...state, searchList: action.searchList }
}

export const clearSearchList = (state, action) => {
  return {
    ...state,
    searchList: [],
    fetching: false,
    error: null,
  }
}

/* ------------- Hookup Reducers To Types ------------- */

export const searchReducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_SEARCH_REQUEST]: request,
  [Types.FETCH_SEARCH_SUCCESS]: success,
  [Types.FETCH_SEARCH_FAILURE]: failure,
  [Types.IMPORT_SEARCH_DATA]: importSearchData,
  [Types.IMPORT_SEARCH_FAILURE]: importSearchFailure,
  [Types.REQ_SEARCH_LIST]: reqSearchList,
  [Types.SET_SEARCH_LIST]: setSearchList,
  [Types.CLEAR_SEARCH_LIST]: clearSearchList
});