import {Platform} from 'react-native';
import {put, all, call} from 'redux-saga/effects';
import {
  MENU_URL_PREFIX,
  TAGS_URL_PREFIX,
  SEARCH_URL_PREFIX,
  LANGUAGES_URL,
  JSON_SUFFIX,
} from '../../constants';
import apiService from '../../utils/api/apiService';
import {
  createSwipeArray,
  getNodeMap,
  generateNormalizedData,
  getSwipeNormResponse,
} from '../../utils/functionCollection';
import LocalStorage from '../../utils/dbAccess/localStorage';
import Types from '../actionTypes';
var RNFS = require('react-native-fs');

function* dispatchFailure(err) {
  yield put({type: Types.IMPORT_SEARCH_FAILURE, err});
}

function* importSearchData({type, data}) {
  let languageCode = 'en';

  try {
    if (data) {
      yield call(afterSearchUpdate, ...[languageCode, data]);
      yield put({type: Types.IMPORT_SEARCH_DATA, data});
    } else {
      let fileRead = () =>
        Platform.OS == 'ios'
          ? RNFS.readFile(
              `${RNFS.MainBundlePath}/data/search-${languageCode}.json`,
              'utf8',
            )
          : RNFS.readFileAssets(`data/search-${languageCode}.json`, 'utf8');

      const searchJson = yield call(fileRead);
      if (searchJson) {
        let newData = JSON.parse(searchJson);
        yield put({type: Types.IMPORT_SEARCH_DATA, data: newData});
      }
    }
  } catch (err) {
    yield call(dispatchFailure, err);
  }
}

export function* importSearchFromLs(languageCode) {
  return yield call(LocalStorage.getItem, ...['search_' + languageCode]);
}

export default importSearchData;
