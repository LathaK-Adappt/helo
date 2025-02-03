import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../utils/api/apiService';
import { NODE_URL_PREFIX, NODE_URL_SUFFIX } from "../constants";

var RNFS = require("react-native-fs");

import localStorage from '../utils/dbAccess/localStorage';

export const getNodeData = async (nid, nodeMap, tags) => {
  try {
    const localNodeData = await AsyncStorage.getItem("" + nid.toString());
    if (localNodeData != null) { // false  
      var parsedLocalNodeData = JSON.parse(localNodeData);

      return await getTagsData(parsedLocalNodeData, nodeMap, tags);

      this.tagsData(parsedLocalNodeData, nodeMap);
    } else {
      return await readNodeData(nid, nodeMap, tags);
    }
  } catch (err) {
    return await readNodeData(nid, nodeMap, tags);
  }
}

const readNodeData = async (nid, nodeMap, tags) => {
  const langugeCode = "en";
  // const nodePath = `data/nodes/${langugeCode}/node_${nid}.json`;
  const nodePath = `data/nodes/node_${nid}.json`;
  let readNodeData = Platform.OS === "ios" ? 
    RNFS.readFile(`${RNFS.MainBundlePath}/${nodePath}`, "utf8") : 
    RNFS.readFileAssets(nodePath, "utf8");
  return readNodeData
    .then(async (result) => {
      if (result) {
        var parsedLocalNodeData = JSON.parse(result);
        return await getTagsData(parsedLocalNodeData, nodeMap, tags);
      } else {
        return fetchNode(nid, nodeMap, tags);
      }
    })
    .catch(error => {
      return fetchNode(nid, nodeMap, tags);
    });
}

const fetchNode = (nid, nodeMap, tags) => {
  const languageCode = "en"
  const URL = `${NODE_URL_PREFIX}node_${nid}${NODE_URL_SUFFIX}`;
  return apiService.fetchApi(URL, 20000).then(async (nodeData) => {
    if (nodeData && nodeData.nid) {
      await AsyncStorage.setItem(nid.toString(), JSON.stringify(nodeData));
      return await getTagsData(nodeData, nodeMap, tags);
    } else {
      return {
        body: null
      }
    }
  }).catch((err) => {
    return { err }
  });
}

const getTagsData = (data, nodeMap, tags) => {
  if (tags && data.field_tags && data.field_tags.length > 0) {
    data.tags = []
    data.field_tags.forEach((item, idx) => {
      let { LText, SText } = tags.data && tags.data[item.tid] ? tags.data[item.tid] : '';
      data.tags[idx] = {
        tid: item.tid,
        tagName: item.name,
        sections: [],
        longText: LText,
        shortText: SText
      };
      data.tags[idx].sections = tags.data[item.tid] ? tags.data[item.tid].nids.map(d => {
        if (d && nodeMap) {
          return {
            title: nodeMap[d].title,
            nid: nodeMap[d].nid,
            menu_type: nodeMap[d].menu_type,
            parent_nid: nodeMap[d].parent_nid
          }
        }
      }) : [];
    });
    return data
  }
  return data
}