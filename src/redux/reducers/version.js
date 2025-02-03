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
    return { ...state, ...action.data, fetching: false, error: null }
}

export const failure = (state, { error }) => {
    return { ...state, fetching: false, error }
}

export const importVersion = (state, action) => {
    return { ...state, ...action.versionInfo, fetching: false, error: null }
}

/* ------------- Hookup Reducers To Types ------------- */

export const versionReducer = createReducer(INITIAL_STATE, {
    [Types.FETCH_VERSION_REQUEST]: request,
    [Types.FETCH_VERSION_SUCCESS]: success,
    [Types.FETCH_VERSION_FAILURE]: failure,
    // [Types.CHECK_VERSION]: checkVersion
    [Types.IMPORT_VERSION]: importVersion
})