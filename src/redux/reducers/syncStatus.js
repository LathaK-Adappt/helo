import { createReducer } from 'reduxsauce';
import Types from '../actionTypes';

export const INITIAL_STATE = {
  syncStatus: "",
  showSyncStatus: false,
  color: 'green'
}

export const setSyncMessage = (state, action) => {
  let color = 'green';
  if(action.isFailureMsg){
    color = 'red'
  }
  return { ...state, ...{ syncStatus: action.message, showSyncStatus: action.showSyncStatus, color } }
}

export const syncReducer = createReducer(INITIAL_STATE, {
  [Types.SET_SYNC_MESSAGE]: setSyncMessage
});