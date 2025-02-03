import { createReducer } from 'reduxsauce';
import Types from '../actionTypes';

export const INITIAL_STATE = {
    nodeMap: {}, 
    isNodeMapReady: false
}

export const setNodeMap = (state, action) => {
    return { ...state, ...action  }
}

/* ------------- Hookup Reducers To Types ------------- */

export const nodeMapReducer = createReducer(INITIAL_STATE, {
    [Types.SET_NODE_MAP_DATA]: setNodeMap
})