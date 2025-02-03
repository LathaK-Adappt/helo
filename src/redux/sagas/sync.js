import {put, all, call, select, delay} from 'redux-saga/effects';
import Types from '../actionTypes';
import {fetchVersion, updateVersion} from './versionSaga';
import importMenuData, {importMenuFromLs} from './importMenuSaga';
import importTagsData, {importTagsFromLs} from './importTagsSaga';
import importSearchData, {importSearchFromLs} from './importSearchSaga';
import importCarouselData from './importCarouselSaga';
import LocalStorage from '../../utils/dbAccess/localStorage';
import {LANGUAGES} from '../../constants/serverAPIS';

function* syncContent() {
  const languageCode = 'en';
  const versionInfo = yield call(LocalStorage.getVersion, languageCode);
  try {
    if (versionInfo !== null) {
      const network = yield select((state) => state.network);
      if (network.isConnected) {
        yield put({
          type: Types.SET_SYNC_MESSAGE,
          message: LANGUAGES[0].checkingUpdate,
          showSyncStatus: true,
        });
        let dbVersion = versionInfo;
        const serverVersion = yield call(fetchVersion, languageCode);
        if (dbVersion.version !== serverVersion.version) {
          yield all([
            put({type: Types.IMPORT_VERSION, versionInfo: serverVersion}),
            put({
              type: Types.SET_SYNC_MESSAGE,
              message: LANGUAGES[0].fetchingUpdate,
              showSyncStatus: true,
            }),
            put({type: Types.FETCH_REQUEST}),
          ]);
        } else {
          yield put({
            type: Types.SET_SYNC_MESSAGE,
            message: LANGUAGES[0].noUpdate,
            showSyncStatus: true,
          }),
            yield delay(1000);
          yield put({
            type: Types.SET_SYNC_MESSAGE,
            message: LANGUAGES[0].noUpdate,
            showSyncStatus: false,
          });
        }
      } else {
        // OFFLINE
      }
    } else {
      yield* importMenuData({data: null});
      yield* importCarouselData({data: null});
      yield* importTagsData({data: null});
      yield* importSearchData({data: null});
      yield* updateVersion();
      yield put({type: Types.START_SYNC});
    }
  } catch (err) {
    yield put({
      type: Types.SET_SYNC_MESSAGE,
      message: LANGUAGES[0].serverIssue,
      showSyncStatus: true,
      isFailureMsg: true,
    });
    yield delay(1000);
    yield put({
      type: Types.SET_SYNC_MESSAGE,
      message: LANGUAGES[0].serverIssue,
      showSyncStatus: false,
      isFailureMsg: true,
    });
  }
}

export default syncContent;
