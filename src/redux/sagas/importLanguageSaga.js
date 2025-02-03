
import { Platform } from "react-native";
import { put, all, call } from 'redux-saga/effects'
import Types from '../actionTypes';
var RNFS = require('react-native-fs');

function* importLanguageData({ type, data }) {
  try {
    if (data) {
      yield call(dispatchAction, ...[data]);
    } else {
      let fileRead = () => Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/languages.json`, 'utf8') : RNFS.readFileAssets(`data/languages.json`, 'utf8');

      const languageJson = yield call(fileRead);
      if (languageJson) {
        let newData = JSON.parse(languageJson);
        yield call(dispatchAction, ...[newData]);
      }
    }

  } catch (err) {
    yield put({ type: Types.IMPORT_LANGUAGE_FAILURE });
  }

}

function* dispatchAction(data) {
  yield put({type: Types.IMPORT_LANGUAGE_DATA, data });
}

export default importLanguageData;