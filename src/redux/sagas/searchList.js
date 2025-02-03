import { put, select } from 'redux-saga/effects'
import Types from '../actionTypes';
import S from "../../utils/string"

export function* getSearchList({ str }) {

  let nodeMap = yield select((state) => state.nodeMap.nodeMap);
  let actualList = yield select((state) => state.search.searchData);

  let searchList = [];
  let strPresent = false;
  if (str.trim() != '' && actualList && actualList !== undefined) {
    searchList = actualList.filter((data) => {
      var nodeData = nodeMap[data.nid];
      data.text_data = data.text_data.replace(/ {1,}/g, ' ');
      var title = '';

      if (nodeData !== undefined) {
        title = nodeData.title;
      }
      var titleLowerCase = title.toLowerCase();
      var strLowerCase = str.toLowerCase();
      var body = data.text_data;
      decodeArticle = S(body).stripTags().decodeHTMLEntities().trim().s;
      var lowerCaseTextData = decodeArticle.toLowerCase().trim();
      if ((lowerCaseTextData.indexOf(strLowerCase) > -1 || titleLowerCase.indexOf(strLowerCase) > -1) && nodeData !== undefined) {
        strPresent = true;
      }
      return ((lowerCaseTextData.indexOf(strLowerCase) > -1 || titleLowerCase.indexOf(strLowerCase) > -1) && nodeData !== undefined);
    });
  } else {
    strPresent = true;
  }
  return yield put({ type: Types.SET_SEARCH_LIST, searchList })
}
