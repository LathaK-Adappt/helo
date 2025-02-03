import {Platform} from 'react-native';
import {all, call} from 'redux-saga/effects';
import {NODE_URL_PREFIX, NODE_URL_SUFFIX} from '../../constants';
import apiService from '../../utils/api/apiService';
var RNFS = require('react-native-fs');
import localStorage from '../../utils/dbAccess/localStorage';
import Config from 'react-native-config';

export function* importNodeRevisions(languageCode) {
  let fileRead = () =>
    Platform.OS == 'ios'
      ? RNFS.readFile(`${RNFS.MainBundlePath}/data/nodeversion.json`, 'utf8')
      : RNFS.readFileAssets(`data/nodeversion.json`, 'utf8');
  const nodeVersions = yield call(fileRead);
  const nodeIdsWithRid = JSON.parse(nodeVersions);
  yield call(
    localStorage.setItem,
    ...[`nodeversions-${languageCode}`, ...[nodeIdsWithRid]],
  );
}

export function* checkNodeRidWithExistOne(
  languageCode,
  currentNodeIds,
  nodeList,
) {
  try {
    let existingNodeIds = yield call(
      localStorage.getItem,
      `nodeversions-${languageCode}`,
    );
    let updatedNodeIds = [];
    Object.keys(currentNodeIds).forEach(nid => {
      if (
        !existingNodeIds[nid] ||
        (existingNodeIds[nid] != currentNodeIds[nid] &&
          (nid != 452 || nid != '452'))
      ) {
        updatedNodeIds.push(nid);
      }
    });
    if (updatedNodeIds && updatedNodeIds.length > 0) {
      const updatedNodeData = yield all(
        updatedNodeIds.map((nid, index) => {
          let _url = `${NODE_URL_PREFIX}node_${nid}${NODE_URL_SUFFIX}`;
          // get checksum  based on nid from the list
          return call(fetchAndUpdateNodes, ...[_url, nid, nodeList]);
        }),
      );
      updatedNodeData.forEach(data => {
        existingNodeIds[data.nid] = data.vid;
      });
      yield call(
        localStorage.setItem,
        ...[`nodeversions-${languageCode}`, existingNodeIds],
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function* fetchAndUpdateNodes(url, nid, nodeList) {
  try {
    // Is Json is loaded
    const tempFilePath = yield call(downloadJson, url, nid);
    checksumKey =
      nodeList && nodeList[nid].checksum ? nodeList[nid].checksum : '';
    if (checksumKey && tempFilePath) {
      // Is checksum is validated
      const isValidated = yield call(
        readFileAndValidateHash,
        checksumKey,
        tempFilePath,
      );
      if (true) {
        const nodeDetails = yield call(getNodeDetail, tempFilePath);
        if (nodeDetails && nodeDetails.nid) {
          yield call(localStorage.setItem, ...[nodeDetails.nid, nodeDetails]);
          yield call(deleteLocalJson, tempFilePath);
          return nodeDetails;
        }
      } else {
        yield call(deleteLocalJson, tempFilePath);
      }
    }
  } catch (err) {
    console.log('^^^^^^', err);
    return err;
  }
}

function* getNodeDetail(filepath) {
  try {
    const result = yield call(RNFS.readFile, filepath);
    return JSON.parse(result);
  } catch (error) {
    console.log('getNodeDetail err:', error);
  }
}
// Used to download and store in Document Directory(localpath)
async function downloadJson(url, nid) {
  const filePath = RNFS.DocumentDirectoryPath + `/${nid}.json`;
  try {
    const download = await RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      background: true,
      readTimeout: 5000,
      connectionTimeout: 5000,
    }).promise;
    return download && download.statusCode == 200 ? filePath : '';
  } catch (error) {
    console.log('download err:', error);
  }
}
// hash local json path and validate checksum
function* readFileAndValidateHash(checkSumKey, filePath) {
  try {
    const result = yield call(RNFS.hash, filePath, 'sha256');
    return result === checkSumKey ? true : false;
  } catch (error) {
    console.log('readFileAndValidateHash err:', error);
  }
}
// validated done,delete the local json file
async function deleteLocalJson(filePath) {
  try {
    const deleted = await RNFS.unlink(filePath).promise;
    return deleted && deleted.statusCode == 200 ? filePath : '';
  } catch (error) {
    console.log('deleteLocalJson err:', error);
  }
}
