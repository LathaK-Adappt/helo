import { takeLatest, all, fork } from 'redux-saga/effects';
import { networkSaga } from 'react-native-offline';

/* ------------- Types ------------- */
import Types from '../actionTypes';

/* ------------- Sagas ------------- */
import fetchApi from './fetchSaga';
import syncContent from './sync';
import { fetchVersion, importVersion, getVersion } from './versionSaga';
import { getSearchList } from './searchList';

/* ------------- API ------------- */
// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    // fork(networkSaga, { pingInterval: 20000 }),
    takeLatest(Types.START_SYNC, syncContent),
    takeLatest(Types.FETCH_REQUEST, fetchApi),
    takeLatest(Types.FETCH_VERSION_REQUEST, fetchVersion),
    takeLatest(Types.IMPORT_VERSION, importVersion),
    takeLatest(Types.REQ_SEARCH_LIST, getSearchList)
  ])
}