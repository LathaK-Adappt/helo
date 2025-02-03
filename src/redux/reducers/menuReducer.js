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

export const importMenuData = (state, action) => {
  return Object.assign({}, state, {
    data: action.data
  })
}
/* ------------- Hookup Reducers To Types ------------- */

export const menuReducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_MENU_REQUEST]: request,
  [Types.FETCH_MENU_SUCCESS]: success,
  [Types.FETCH_MENU_FAILURE]: failure,
  [Types.IMPORT_MENU_DATA]: importMenuData
});