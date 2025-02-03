import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  startSync: ['data'],
  setSyncMessage: ['message', 'showSyncStatus', 'isFailureMsg'],
  setNodeMapData: ['nodemap', 'isNodeMapReady'],
  setSwipeArray: ['swipeArrayNodes', 'isSwipeArrayReady'],
});

export const fetchTypes = Types;
export default Creators;
