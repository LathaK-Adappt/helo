import {put, all, call, select, delay} from 'redux-saga/effects';
import {normalize, schema} from 'normalizr';
import {
  MENU_URL_PREFIX,
  TAGS_URL_PREFIX,
  SEARCH_URL_PREFIX,
  LANGUAGES_URL,
  JSON_SUFFIX,
  NODE_VERSION_URL,
  CAROUSEL_URL,
} from '../../constants';
import apiService from '../../utils/api/apiService';
import Types from '../actionTypes';
import {
  createSwipeArray,
  getNodeMap,
  generateNormalizedData,
  getSwipeNormResponse,
} from '../../utils/functionCollection';
import importMenuData from './importMenuSaga';
import importTagsData from './importTagsSaga';
import importSearchData from './importSearchSaga';
import importCarouselData from './importCarouselSaga';
import {checkNodeRidWithExistOne} from './checkNodeRevision';
import {updateVersion} from './versionSaga';
import {LANGUAGES} from '../../constants/serverAPIS';
//import { decryptAndHash } from '../sagas/decryptHash'
import RNFS from 'react-native-fs';

function* fetchData() {
  const {fetchApi} = apiService;
  const languageCode = 'en';
  yield put({type: Types.FETCH_MENU_REQUEST});
  yield put({type: Types.FETCH_SEARCH_REQUEST});
  try {
    const [menu, nodeVersions, search] = yield all([
      call(
        fetchApi,
        ...[`${MENU_URL_PREFIX}-${languageCode}${JSON_SUFFIX}`, 20000],
      ),
      call(fetchApi, ...[NODE_VERSION_URL, 20000]),
      call(
        fetchApi,
        ...[`${SEARCH_URL_PREFIX}-${languageCode}${JSON_SUFFIX}`, 20000],
      ),
    ]);
    if (
      menu &&
      Array.isArray(menu) &&
      menu.length > 0 &&
      search &&
      Array.isArray(search) &&
      search.length > 0
    ) {
      yield put({type: Types.FETCH_MENU_SUCCESS});
      yield put({type: Types.FETCH_SEARCH_SUCCESS});

      const jsonNormalizedData = yield call(generateNormalizedData, ...[menu]);
      const nodeList = jsonNormalizedData.node.entities.data
        ? jsonNormalizedData.node.entities.data
        : [];
      const version = yield select((state) => state.version);
      yield call(importMenuData, {data: jsonNormalizedData}),
        yield call(importSearchData, {data: search}),
        yield call(
          checkNodeRidWithExistOne,
          ...[languageCode, nodeVersions, nodeList],
        ),
        yield call(updateVersion, version);

      yield put({
        type: Types.SET_SYNC_MESSAGE,
        message: LANGUAGES[0].updateSuccess,
        showSyncStatus: true,
      });
      yield delay(1000);
      yield put({
        type: Types.SET_SYNC_MESSAGE,
        message: LANGUAGES[0].updateSuccess,
        showSyncStatus: false,
      });
    } else {
      yield put({
        type: Types.FETCH_MENU_FAILURE,
        error: 'Fetching Data failed',
      });
      yield put({
        type: Types.FETCH_SEARCH_FAILURE,
        error: 'Fetching Data failed',
      });
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
  } catch (error) {
    console.log('error ------', error);
    yield put({type: Types.FETCH_FAILURE, error});
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
export default fetchData;
