// import * as types from '../constants/actionTypes';
import {
  MENU_URL_PREFIX,
  NODE_URL_PREFIX,
  NODE_URL_SUFFIX,
  SEARCH_URL_PREFIX,
  TAGS_URL_PREFIX,
  JSON_SUFFIX,
} from '../constants';
import {normalize, schema} from 'normalizr';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
var RNFS = require('react-native-fs');

export async function createSwipeArray(nodeMap, firstElement) {
  var dummyNid = firstElement.nid;
  var dummyData = nodeMap[dummyNid];
  do {
    var dummyPrev = dummyData.prev_nid;
    if (dummyPrev !== undefined) {
      dummyData = nodeMap[dummyPrev];
    }
  } while (dummyPrev !== undefined);

  firstElement = dummyData;

  var swipeArrayNodes = [firstElement.nid];
  var nid = firstElement.nid;
  var nodeData = nodeMap[nid];
  var nextNid = nodeData.next_nid;
  do {
    var nodeData = nodeMap[nid];
    var nextNid = nodeData.next_nid;
    if (
      nextNid !== undefined &&
      nextNid !== null &&
      !swipeArrayNodes.includes(nextNid)
    ) {
      swipeArrayNodes.push(nextNid);
      nid = nextNid;
    }
  } while (nextNid !== undefined && nextNid !== null);
  return swipeArrayNodes;
  // store.dispatch({type: types.SET_SWIPE_ARRAY, swipeArrayNodes: swipeArrayNodes, swipeArrayReady: true});
}

/* preparing array based on start_swipe and end_swipe key from menu json */
export async function swipeRestrictionArray(nodeMap, firstElement) {
  let arrayOfSwipeElements = [];
  firstElement.map((swipeStartElement) => {
    return arrayOfSwipeElements.push([swipeStartElement.nid]);
  });
  let restrictSwipeArrayNodes = [];
  arrayOfSwipeElements.forEach((data) => {
    var swipeArrayPerRow = data;
    var nid = data[0];
    var nodeData = nodeMap[nid];
    var nextNid = nodeData.next_nid;
    let flag = false;
    do {
      var nodeData = nodeMap[nid];
      var nextNid = nodeData.next_nid;
      if (nodeMap[nextNid].hasOwnProperty('end_swipe')) {
        flag = true;
      }
      if (
        nextNid !== undefined &&
        nextNid !== null &&
        !swipeArrayPerRow.includes(nextNid)
      ) {
        swipeArrayPerRow.push(nextNid);
        nid = nextNid;
      }
    } while (!flag);
    // console.log('swipeArrayPerRow >> ', JSON.stringify(swipeArrayPerRow));
    restrictSwipeArrayNodes.push(swipeArrayPerRow);
  });
  // console.log('restrictSwipeArrayNodes >> ', restrictSwipeArrayNodes);
  return restrictSwipeArrayNodes;
}

export function getSwipeNormResponse(jsonNormalizedData) {
  var articlesEntityNormResponse =
    jsonNormalizedData.articles.entities.data !== undefined
      ? jsonNormalizedData.articles.entities.data
      : {};
  var contentmenulistEntityNormResponse =
    jsonNormalizedData.contentmenulist.entities.data !== undefined
      ? jsonNormalizedData.contentmenulist.entities.data
      : {};
  var mirrorcontentEntityNormResponse =
    jsonNormalizedData.mirrorcontent.entities.data !== undefined
      ? jsonNormalizedData.mirrorcontent.entities.data
      : {};
  var decisiontreeEntityNormResponse =
    jsonNormalizedData.decisiontree.entities.data !== undefined
      ? jsonNormalizedData.decisiontree.entities.data
      : {};
  var accordEntityNormResponse =
    jsonNormalizedData.accord.entities.data !== undefined
      ? jsonNormalizedData.accord.entities.data
      : {};
  var newsFeedEntityNormResponse =
    jsonNormalizedData.newsFeed.entities.data !== undefined
      ? jsonNormalizedData.newsFeed.entities.data
      : {};

  const swipeNormResponse = Object.assign(
    {},
    articlesEntityNormResponse,
    contentmenulistEntityNormResponse,
    mirrorcontentEntityNormResponse,
    decisiontreeEntityNormResponse,
    accordEntityNormResponse,
    newsFeedEntityNormResponse,
  );
  var swipeResultNodesArray = [];
  Object.keys(swipeNormResponse).forEach(function (c) {
    swipeResultNodesArray.push(swipeNormResponse[c]);
  });

  return swipeResultNodesArray;
}

export function getAllEntities(jsonNormalizedData) {
  var entityNormResponse =
    jsonNormalizedData.articles.entities.data !== undefined
      ? jsonNormalizedData.articles.entities.data
      : {};
  var articlesEntityNormResponse =
    jsonNormalizedData.articles.entities.data !== undefined
      ? jsonNormalizedData.articles.entities.data
      : {};
  var contentmenulistEntityNormResponse =
    jsonNormalizedData.contentmenulist.entities.data !== undefined
      ? jsonNormalizedData.contentmenulist.entities.data
      : {};
  var menuEntityNormResponse =
    jsonNormalizedData.menu.entities.data !== undefined
      ? jsonNormalizedData.menu.entities.data
      : {};
  var menulistEntityNormResponse =
    jsonNormalizedData.menulist.entities.data !== undefined
      ? jsonNormalizedData.menulist.entities.data
      : {};
  var menusquareslistEntityNormResponse =
    jsonNormalizedData.menusquareslist.entities.data !== undefined
      ? jsonNormalizedData.menusquareslist.entities.data
      : {};
  var mirrorcontentEntityNormResponse =
    jsonNormalizedData.mirrorcontent.entities.data !== undefined
      ? jsonNormalizedData.mirrorcontent.entities.data
      : {};
  var decisiontreeEntityNormResponse =
    jsonNormalizedData.decisiontree.entities.data !== undefined
      ? jsonNormalizedData.decisiontree.entities.data
      : {};
  var accordEntityNormResponse =
    jsonNormalizedData.accord.entities.data !== undefined
      ? jsonNormalizedData.accord.entities.data
      : {};
  var newsFeedEntityNormResponse =
    jsonNormalizedData.newsFeed.entities.data !== undefined
      ? jsonNormalizedData.newsFeed.entities.data
      : {};
  const allNormResponse = Object.assign(
    {},
    articlesEntityNormResponse,
    contentmenulistEntityNormResponse,
    menuEntityNormResponse,
    menulistEntityNormResponse,
    mirrorcontentEntityNormResponse,
    menusquareslistEntityNormResponse,
    decisiontreeEntityNormResponse,
    accordEntityNormResponse,
    newsFeedEntityNormResponse,
  );
  return allNormResponse;
}

export function getAllResults(jsonNormalizedData) {
  var articlesResultNodesArray =
    jsonNormalizedData.articles !== undefined
      ? jsonNormalizedData.articles.result.data
      : [];
  var contentmenulistResultNodesArray =
    jsonNormalizedData.contentmenulist !== undefined
      ? jsonNormalizedData.contentmenulist.result.data
      : [];
  var menuResultNodesArray =
    jsonNormalizedData.menu !== undefined
      ? jsonNormalizedData.menu.result.data
      : [];
  var menulistResultNodesArray =
    jsonNormalizedData.menulist !== undefined
      ? jsonNormalizedData.menulist.result.data
      : [];
  var menusquareslistResultNodesArray =
    jsonNormalizedData.menusquareslist !== undefined
      ? jsonNormalizedData.menusquareslist.result.data
      : [];
  var mirrorcontentResultNodesArray =
    jsonNormalizedData.mirrorcontent !== undefined
      ? jsonNormalizedData.mirrorcontent.result.data
      : [];
  var decisiontreeResultNodesArray =
    jsonNormalizedData.decisiontree !== undefined
      ? jsonNormalizedData.decisiontree.result.data
      : [];
  var accordResultNodesArray =
    jsonNormalizedData.accord !== undefined
      ? jsonNormalizedData.accord.result.data
      : [];
  var newsFeedResultNodesArray =
    jsonNormalizedData.newsFeed !== undefined
      ? jsonNormalizedData.newsFeed.result.data
      : [];

  const allResultNodesArray = articlesResultNodesArray.concat(
    contentmenulistResultNodesArray,
    menuResultNodesArray,
    menulistResultNodesArray,
    mirrorcontentResultNodesArray,
    menusquareslistResultNodesArray,
    decisiontreeResultNodesArray,
    accordResultNodesArray,
    newsFeedResultNodesArray,
  );
  return allResultNodesArray;
}

export function getNodeMap(jsonNormalizedData) {
  var topMenu =
    jsonNormalizedData.topMenu !== undefined ? jsonNormalizedData.topMenu : {};
  var articles =
    jsonNormalizedData.articles.entities.data !== undefined
      ? jsonNormalizedData.articles.entities.data
      : {};
  var menu =
    jsonNormalizedData.menu.entities.data !== undefined
      ? jsonNormalizedData.menu.entities.data
      : {};
  var menulist =
    jsonNormalizedData.menulist.entities.data !== undefined
      ? jsonNormalizedData.menulist.entities.data
      : {};
  var menusquareslist =
    jsonNormalizedData.menusquareslist.entities.data !== undefined
      ? jsonNormalizedData.menusquareslist.entities.data
      : {};
  var contentmenulist =
    jsonNormalizedData.contentmenulist.entities.data !== undefined
      ? jsonNormalizedData.contentmenulist.entities.data
      : {};
  var mirrorcontent =
    jsonNormalizedData.mirrorcontent.entities.data !== undefined
      ? jsonNormalizedData.mirrorcontent.entities.data
      : {};
  var decisiontree =
    jsonNormalizedData.decisiontree.entities.data !== undefined
      ? jsonNormalizedData.decisiontree.entities.data
      : {};
  var accord =
    jsonNormalizedData.accord.entities.data !== undefined
      ? jsonNormalizedData.accord.entities.data
      : {};
  var newsFeed =
    jsonNormalizedData.newsFeed.entities.data !== undefined
      ? jsonNormalizedData.newsFeed.entities.data
      : {};

  var nodeMap = {};

  nodeMap[topMenu.nid] = topMenu;

  Object.keys(articles).forEach(function (c) {
    nodeMap[c] = articles[c];
  });

  Object.keys(menu).forEach(function (c) {
    nodeMap[c] = menu[c];
  });

  Object.keys(menulist).forEach(function (c) {
    nodeMap[c] = menulist[c];
  });

  Object.keys(contentmenulist).forEach(function (c) {
    nodeMap[c] = contentmenulist[c];
  });

  Object.keys(mirrorcontent).forEach(function (c) {
    nodeMap[c] = mirrorcontent[c];
  });

  Object.keys(menusquareslist).forEach(function (c) {
    nodeMap[c] = menusquareslist[c];
  });

  Object.keys(decisiontree).forEach(function (c) {
    nodeMap[c] = decisiontree[c];
  });

  Object.keys(accord).forEach(function (c) {
    nodeMap[c] = accord[c];
  });

  Object.keys(newsFeed).forEach(function (c) {
    nodeMap[c] = newsFeed[c];
  });
  return nodeMap;
}

export function findHomeScreenData(topMenuNid, topMenuRid) {
  AsyncStorage.getItem(topMenuNid)
    .then((localTopMenuData) => {
      if (localTopMenuData !== null) {
        var localParsedTopMenuData = JSON.parse(localTopMenuData);
        if (topMenuRid !== localParsedTopMenuData.vid) {
          // check for updated homescreen.
          updateHomeData(topMenuNid, topMenuRid, localParsedTopMenuData);
        } else {
          // set the data to homescreen.
          // store.dispatch({type: types.SET_HOME_DATA, data: localParsedTopMenuData});
        }
      } else {
        if (Platform.OS == 'ios') {
          RNFS.readFile(
            `${RNFS.MainBundlePath}/data/nodes/node_${topMenuNid}.json`,
            'utf8',
          )
            .then((result) => {
              var parsedLocalData = JSON.parse(result);
              if (topMenuRid !== parsedLocalData.vid) {
                // check for updated homescreen.
                updateHomeData(topMenuNid, topMenuRid, parsedLocalData);
              } else {
                // set the data to homescreen.
                // store.dispatch({type: types.SET_HOME_DATA, data: parsedLocalData});
              }
            })
            .catch((error) => {});
        } else {
          RNFS.readFileAssets(`data/nodes/node_${topMenuNid}.json`, 'utf8')
            .then((result) => {
              var parsedLocalData = JSON.parse(result);
              if (topMenuRid !== parsedLocalData.vid) {
                // check for updated homescreen.
                updateHomeData(topMenuNid, topMenuRid, parsedLocalData);
              } else {
                // set the data to homescreen.
                // store.dispatch({type: types.SET_HOME_DATA, data: parsedLocalData});
              }
            })
            .catch((error) => {});
        }
      }
    })
    .catch((error) => {});
}

function updateHomeData(topMenuNid, topMenuRid, localParsedTopMenuData) {
  axios
    .get(NODE_URL_PREFIX + topMenuNid + NODE_URL_SUFFIX, {
      headers: {
        'Cache-Control': 'no-cache',
      },
      timeout: 20000,
    })
    .then(async function (response) {
      AsyncStorage.setItem(topMenuNid, JSON.stringify(response.data));
      AsyncStorage.setItem(topMenuNid + '_rid', JSON.stringify(topMenuRid));
      // store.dispatch({type: types.SET_HOME_DATA, data: response.data});
    })
    .catch(function (error) {
      // store.dispatch({type: types.SET_HOME_DATA, data: localParsedTopMenuData});
    });
}

export function generateNormalizedData(data) {
  const myData = {data: data[0].deeperlink};
  const topMenu = {
    nid: data[0].nid,
    rid: data[0].rid,
    menu_type: data[0].menu_type,
    next_nid: data[0].next_nid,
    title: data[0].title,
    home_view_content: data[0].home_view_content,
    home_view_image: data[0].home_view_image,
  };
  // var homeData = {home_view_content: topMenu.home_view_content, home_view_image: topMenu.home_view_image};
  // store.dispatch({type: types.SET_HOME_DATA, data: homeData});
  var topMenuNid = data[0].nid;
  var topMenuRid = data[0].rid;

  const menu = new schema.Entity('data', {}, {idAttribute: 'nid'});
  const mySchema = {data: [menu]};
  const normalizedData = normalize(myData, mySchema);

  var menuList = [];
  var menusquaresList = [];
  var mirrorContentList = [];
  var contentData = [];
  var contentMenuListData = [];
  var decisionTreeData = [];
  var accordData = [];
  var newsfeedData = [];
  var topmenu = [];
  var nodeList = [];

  function recursiveDeeperLink(items) {
    items.forEach((element) => {
      if (element.deeperlink) {
        element['children'] = element.deeperlink.map((d) => {
          return d.nid;
        });

        //nodeList[element.nid] = element?.rid
        nodeList.push({
          nid: element.nid,
          checksum: element.field_checksum,
        });

        switch (element.menu_type) {
          case 'menu_list':
            menuList.push(element);
            break;
          case 'content':
            contentData.push(element);
            break;
          case 'content-menulist':
            contentMenuListData.push(element);
            break;
          case 'mirror_content':
            mirrorContentList.push(element);
            break;
          case 'menu_squares':
            menusquaresList.push(element);
            break;
          case 'top_menu':
            topMenu.push(element);
            break;
          case 'decision_tree':
            decisionTreeData.push(element);
            break;
          case 'accord':
            accordData.push(element);
            break;
          case 'news_feed':
            newsfeedData.push(element);
            break;
        }
        recursiveDeeperLink(element.deeperlink);
      } else {
        //nodeList[element.nid] = element?.rid
        nodeList.push({
          nid: element.nid,
          checksum: element.field_checksum,
        });

        if (element.menu_type === 'menu_list') {
          menuList.push(element);
        } else if (element.menu_type === 'content-menulist') {
          contentMenuListData.push(element);
        } else if (element.menu_type === 'mirror_content') {
          mirrorContentList.push(element);
        } else if (element.menu_type === 'menu_squares') {
          menusquaresList.push(element);
        } else if (element.menu_type === 'decision_tree') {
          decisionTreeData.push(element);
        } else if (element.menu_type === 'accord') {
          accordData.push(element);
        } else if (element.menu_type === 'news_feed') {
          newsfeedData.push(element);
        }
        contentData.push(element);
      }
    });
  }
  //Object.keys(nodeList).length
  recursiveDeeperLink(data[0].deeperlink);
  const _nodeList = {data: nodeList};
  const _nodeListdata = new schema.Entity('data', {}, {idAttribute: 'nid'});
  const nodeListSchema = {data: [_nodeListdata]};
  const normalizednodeList = normalize(_nodeList, nodeListSchema);

  const _menuList = {data: menuList};
  const _menuListdata = new schema.Entity('data', {}, {idAttribute: 'nid'});
  const menuListSchema = {data: [_menuListdata]};
  const normalizedMenuList = normalize(_menuList, menuListSchema);

  const _menusquaresList = {data: menusquaresList};
  const _menusquaresListdata = new schema.Entity(
    'data',
    {},
    {idAttribute: 'nid'},
  );
  const menusquaresListSchema = {data: [_menusquaresListdata]};
  const normalizedMenuSquaresList = normalize(
    _menusquaresList,
    menusquaresListSchema,
  );

  const _content = {data: contentData};
  const _contentdata = new schema.Entity('data', {}, {idAttribute: 'nid'});
  const contentSchema = {data: [_contentdata]};
  const normalizedContentData = normalize(_content, contentSchema);

  const _contentMenuList = {data: contentMenuListData};
  const _contentMenuListdata = new schema.Entity(
    'data',
    {},
    {idAttribute: 'nid'},
  );
  const contentMenuListSchema = {data: [_contentMenuListdata]};
  const normalizedContentMenuListData = normalize(
    _contentMenuList,
    contentMenuListSchema,
  );

  const _mirrorContentList = {data: mirrorContentList};
  const _mirrorContentListdata = new schema.Entity(
    'data',
    {},
    {idAttribute: 'nid'},
  );
  const mirrorContentListSchema = {data: [_mirrorContentListdata]};
  const normalizedMirrorContentList = normalize(
    _mirrorContentList,
    mirrorContentListSchema,
  );

  const _decisionTreeList = {data: decisionTreeData};
  const _decisionTreeListdata = new schema.Entity(
    'data',
    {},
    {idAttribute: 'nid'},
  );
  const decisionTreeListSchema = {data: [_decisionTreeListdata]};
  const normalizedDecisionTree = normalize(
    _decisionTreeList,
    decisionTreeListSchema,
  );

  const _accordList = {data: accordData};
  const _accordListdata = new schema.Entity('data', {}, {idAttribute: 'nid'});
  const accordListSchema = {data: [_accordListdata]};
  const normalizedAccord = normalize(_accordList, accordListSchema);

  const _newsfeedList = {data: newsfeedData};
  const _newsfeedListdata = new schema.Entity('data', {}, {idAttribute: 'nid'});
  const newsfeedListSchema = {data: [_newsfeedListdata]};
  const normalizedNewsfeed = normalize(_newsfeedList, newsfeedListSchema);

  var jsonData = {
    topMenu: topMenu,
    menu: normalizedData,
    menulist: normalizedMenuList,
    menusquareslist: normalizedMenuSquaresList,
    contentmenulist: normalizedContentMenuListData,
    articles: normalizedContentData,
    mirrorcontent: normalizedMirrorContentList,
    decisiontree: normalizedDecisionTree,
    accord: normalizedAccord,
    newsFeed: normalizedNewsfeed,
    node: normalizednodeList,
  };
  return jsonData;
}

export function storeNodeData(jsonNormalizedData) {
  var topMenu =
    jsonNormalizedData.topMenu !== undefined ? jsonNormalizedData.topMenu : {};
  var articles =
    jsonNormalizedData.articles.entities.data !== undefined
      ? jsonNormalizedData.articles.entities.data
      : {};
  var menu =
    jsonNormalizedData.menu.entities.data !== undefined
      ? jsonNormalizedData.menu.entities.data
      : {};
  var menulist =
    jsonNormalizedData.menulist.entities.data !== undefined
      ? jsonNormalizedData.menulist.entities.data
      : {};
  var menusquareslist =
    jsonNormalizedData.menusquareslist.entities.data !== undefined
      ? jsonNormalizedData.menusquareslist.entities.data
      : {};
  var contentmenulist =
    jsonNormalizedData.contentmenulist.entities.data !== undefined
      ? jsonNormalizedData.contentmenulist.entities.data
      : {};
  var mirrorcontent =
    jsonNormalizedData.mirrorcontent.entities.data !== undefined
      ? jsonNormalizedData.mirrorcontent.entities.data
      : {};
  var decisiontree =
    jsonNormalizedData.decisiontree.entities.data !== undefined
      ? jsonNormalizedData.decisiontree.entities.data
      : {};
  var accord =
    jsonNormalizedData.accord.entities.data !== undefined
      ? jsonNormalizedData.accord.entities.data
      : {};
  var newsFeed =
    jsonNormalizedData.newsFeed.entities.data !== undefined
      ? jsonNormalizedData.newsFeed.entities.data
      : {};
  var nodeMap = new Map();

  nodeMap.set(topMenu.nid, topMenu);

  Object.keys(articles).forEach(function (c) {
    nodeMap.set(c, articles[c]);
  });

  Object.keys(menu).forEach(function (c) {
    nodeMap.set(c, menu[c]);
  });

  Object.keys(menulist).forEach(function (c) {
    nodeMap.set(c, menulist[c]);
  });

  Object.keys(contentmenulist).forEach(function (c) {
    nodeMap.set(c, contentmenulist[c]);
  });

  Object.keys(mirrorcontent).forEach(function (c) {
    nodeMap.set(c, mirrorcontent[c]);
  });

  Object.keys(menusquareslist).forEach(function (c) {
    nodeMap.set(c, menusquareslist[c]);
  });

  Object.keys(decisiontree).forEach(function (c) {
    nodeMap.set(c, decisiontree[c]);
  });

  Object.keys(accord).forEach(function (c) {
    nodeMap.set(c, accord[c]);
  });

  Object.keys(newsFeed).forEach(function (c) {
    nodeMap.set(c, newsFeed[c]);
  });
  store.dispatch({
    type: types.SET_NODE_DATA_MAP,
    nodeMap: nodeMap,
    nodeMapReady: true,
  });

  return nodeMap;
}

export async function updateTag(selected_language, normalizedTagList) {
  var TAGS_URL = `${TAGS_URL_PREFIX}-${selected_language}${JSON_SUFFIX}`;
  axios
    .get(TAGS_URL, {
      headers: {
        'Cache-Control': 'no-cache',
      },
      timeout: 5000,
    })
    .then(function (response) {
      AsyncStorage.setItem(
        'tags_content_' + selected_language,
        JSON.stringify(response.data),
      );
      const _tagList = {data: response.data};
      const _tagListdata = new schema.Entity('data', {}, {idAttribute: 'tid'});
      const tagListSchema = {data: [_tagListdata]};
      const normalizedTagList = normalize(_tagList, tagListSchema);
      store.dispatch({type: types.FETCH_TAG_DATAS, data: normalizedTagList});
    })
    .catch(function (error) {
      store.dispatch({type: types.FETCH_TAG_DATAS, data: normalizedTagList});
    });
}

export async function updateSearch(selected_language, parsedSearch_content) {
  var SEARCH_URL = `${SEARCH_URL_PREFIX}-${selected_language}${JSON_SUFFIX}`;
  axios
    .get(SEARCH_URL, {
      // check for updates.
      headers: {
        'Cache-Control': 'no-cache',
      },
      timeout: 5000,
    })
    .then(function (response) {
      AsyncStorage.setItem(
        'search_content_' + selected_language,
        JSON.stringify(response.data),
      );
      // store.dispatch({type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: response.data});
    })
    .catch(function (error) {
      // store.dispatch({type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content });
    });
}

export async function resetdata() {
  store.dispatch({
    type: types.SET_NODE_DATA_MAP,
    nodeMap: new Map(),
    nodeMapReady: false,
  });
  // store.dispatch({type: types.SET_SWIPE_ARRAY, swipeArrayNodes: [], swipeArrayReady: false});
  // store.dispatch({type: types.SET_HOME_IMAGE_LOADED, imageLoaded: false});
  store.dispatch({type: types.FETCH_TAG_DATAS, data: undefined});
  // store.dispatch({type: types.SET_HOME_DATA, data: {}});  // clearing home data.
}
