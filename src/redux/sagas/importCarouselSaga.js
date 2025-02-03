import {AsyncStorage, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {put, all, call} from 'redux-saga/effects';
import Types from '../actionTypes';
var RNFS = require('react-native-fs');

export function* importCarouselData({data}) {
  let languageCode = 'en';
  try {
    if (data) {
      yield put({type: Types.IMPORT_CAROUSEL_DATA, data});
    } else {
      let fileRead = () =>
        Platform.OS == 'ios'
          ? RNFS.readFile(`${RNFS.MainBundlePath}/data/carousel.json`, 'utf8')
          : RNFS.readFileAssets(`data/carousel.json`, 'utf8');
      const carouselJson = yield call(fileRead);
      if (carouselJson) {
        let newData = JSON.parse(carouselJson);
        yield put({type: Types.IMPORT_CAROUSEL_DATA, data: newData});
      }
    }
  } catch (err) {
    yield put({type: Types.IMPORT_CAROUSEL_FAILURE, err});
  }
}

export default importCarouselData;
