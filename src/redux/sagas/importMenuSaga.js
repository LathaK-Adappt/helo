
import { AsyncStorage, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { put, all, call } from 'redux-saga/effects'
import { MENU_URL_PREFIX, TAGS_URL_PREFIX, SEARCH_URL_PREFIX, LANGUAGES_URL, JSON_SUFFIX } from '../../constants';
import apiService from '../../utils/api/apiService';
import { createSwipeArray, getNodeMap, generateNormalizedData, getSwipeNormResponse, swipeRestrictionArray } from '../../utils/functionCollection';
import LocalStorage from '../../utils/dbAccess/localStorage';
import Types from '../actionTypes';
import { importNodeRevisions } from './checkNodeRevision';
var RNFS = require('react-native-fs');

function* dispatchFailure(err) {
  yield put({ type: Types.IMPORT_MENU_FAILURE, err });
}

function* responseHandler({ res, data }) {
  if (res && res.err) {
    yield call(dispatchFailure, res.err);
  } else {
    yield put({ type: Types.IMPORT_MENU_DATA, data })
  }
}

function* importMenuData({ data }) {
  // console.log('menudata', data);
  let languageCode = 'en';
  try {
    if (data) {
      const res = yield call(updateMenuData, ...[languageCode, data, false]);
      yield call(responseHandler, { res, data })
    } else {
      let fileRead = () => Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/menu-${languageCode}.json`, 'utf8') :
       RNFS.readFileAssets(`data/menu-${languageCode}.json`, 'utf8');
      const menuJson = yield call(fileRead);

      if (menuJson) {
        let parsedData = JSON.parse(menuJson);

        const jsonNormalizedData = yield call(generateNormalizedData, ...[parsedData]);

        const res = yield call(updateMenuData, ...[languageCode, jsonNormalizedData, true]);
        yield call(responseHandler, { res, data: jsonNormalizedData });
      }
    }
  } catch (err) {
    yield call(dispatchFailure, err)
  }
}

function* updateMenuData(languageCode, data, initialImport) {
  try {
    yield call(menuDispatchEvents, ...[data]);
    if (initialImport) {
      yield call(importNodeRevisions, ...[languageCode]);
    }
    yield call(LocalStorage.setItem, ...['menu_' + languageCode, data]);
    return true;
  } catch (error) {
    // console.log('log >> catch block', error);
    return { err: error };
  }
}

function* menuDispatchEvents(jsonNormalizedData) {
  var localMenuNodeData = yield call(getNodeMap, ...[jsonNormalizedData]);
  yield put({ type: Types.SET_NODE_MAP_DATA, nodeMap: localMenuNodeData, isNodeMapReady: true });

  var swipeResultNodesArray = yield call(getSwipeNormResponse, ...[jsonNormalizedData]);
  const swipeArray = yield call(createSwipeArray, ...[localMenuNodeData, swipeResultNodesArray[0]]);
  yield put({ 
    type: Types.SET_SWIPE_ARRAY_NODES, 
    swipeArrayNodes: swipeArray,
    restrictionSwipe: [], 
    isSwipeArrayReady: true
  });
}

export function* importMenuFromLs(languageCode) {
  return yield call(LocalStorage.getItem, ...['menu_' + languageCode]);
}
export default importMenuData