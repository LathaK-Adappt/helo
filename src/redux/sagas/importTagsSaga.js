import {AsyncStorage, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
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
import {normalize, schema} from 'normalizr';
var RNFS = require('react-native-fs');

function* dispatchFailure(err) {
  yield put({type: Types.IMPORT_TAGS_FAILURE, err});
}

function* responseHandler({res, data}) {
  if (res && res.err) {
    yield call(dispatchFailure, res.err);
  } else {
    yield put({type: Types.IMPORT_TAGS_DATA, data});
  }
}

export function* importTagsData({data}) {
  let languageCode = 'en';
  try {
    if (data) {
      const res = yield call(updateTagsData, ...[languageCode, data]);
      yield call(responseHandler, {res, data});
    } else {
      let fileRead = () =>
        Platform.OS == 'ios'
          ? RNFS.readFile(
              `${RNFS.MainBundlePath}/data/tags-${languageCode}.json`,
              'utf8',
            )
          : RNFS.readFileAssets(`data/tags-${languageCode}.json`, 'utf8');
      const tagsJson = yield call(fileRead);

      if (tagsJson) {
        let newData = JSON.parse(tagsJson);
        const _tagList = {data: newData};
        const _tagListdata = new schema.Entity(
          'data',
          {},
          {idAttribute: 'tid'},
        );
        const tagListSchema = {data: [_tagListdata]};
        const normalizedTagList = normalize(_tagList, tagListSchema);

        const res = yield call(
          updateTagsData,
          ...[languageCode, normalizedTagList],
        );
        yield call(responseHandler, {res, data: normalizedTagList});
      }
    }
  } catch (err) {
    yield call(dispatchFailure, err);
  }
}

function* updateTagsData(languageCode, data) {
  yield call(tagsDispatchEvents, ...[data]);
  try {
    yield call(LocalStorage.setItem, ...['tags_' + languageCode, data]);
    return true;
  } catch (err) {
    return {err};
  }
}

function* tagsDispatchEvents(data) {
  const _tagList = { data: data };
  const _tagListdata = new schema.Entity('data', {}, { idAttribute: 'tid' });
  const tagListSchema = { data: [_tagListdata] };
  const normalizedTagList = normalize(_tagList, tagListSchema);
  store.dispatch({ type: types.FETCH_TAG_DATAS, data: normalizedTagList });
}

export function* importTagsFromLs(languageCode) {
  return yield call(LocalStorage.getItem, ...['tags_' + languageCode]);
}

export default importTagsData;
