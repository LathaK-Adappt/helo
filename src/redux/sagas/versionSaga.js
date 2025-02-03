import { Platform } from "react-native";
import { put, all, call } from 'redux-saga/effects'
import { VERSION_URL, JSON_SUFFIX } from '../../constants';
import apiService from '../../utils/api/apiService';
import localStorage from '../../utils/dbAccess/localStorage';
import Types from '../actionTypes';
import DeviceInfo from 'react-native-device-info';
var RNFS = require('react-native-fs');

const deviceVersion = DeviceInfo.getVersion();
const deviceNumber = DeviceInfo.getBuildNumber();

export function* fetchVersion() {
  const { fetchApi } = apiService;

  return yield call(fetchApi, ...[VERSION_URL, 20000]);
}

export function* importVersion() {
  // yield({types: Types.IMPORT_VERSION, })
}

export function* getVersionFromDb(languageCode) {
  return yield call(localStorage.getVersion, ...[languageCode])
}

export function* updateVersion(versionJson) {
  yield call(localStorage.removeItem, `version_en`);
  if (!versionJson) {
    let fileRead = () => Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/version.json`, 'utf8') : RNFS.readFileAssets(`data/version.json`, 'utf8');

    const version = yield call(fileRead);
    versionJson = JSON.parse(version);
  }

  versionJson.device_number = deviceNumber;
  versionJson.device_version = deviceVersion;

  yield call(localStorage.saveVersion, ...['en', versionJson]);
  return versionJson;
}
