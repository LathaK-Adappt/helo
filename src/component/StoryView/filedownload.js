import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
var RNFS = require('react-native-fs');
import React, {Component} from 'react';

import {Alert, Platform, View, Text} from 'react-native';
export function filedownload(filename) {
  console.log(filename, 'file:::');
  let dirs = RNFetchBlob.fs.dirs;
  let PATH_OF_FILE = dirs.DocumentDir + '/' + filename;
  RNFetchBlob.fs
    .exists(PATH_OF_FILE)
    .then((exist) => {
      if (exist) {
        FileViewerApp(PATH_OF_FILE);
      } else {
        let readNodeData =
          Platform.OS === 'ios'
            ? RNFS.exists(
                `${RNFS.MainBundlePath}/data/files/${filename}`,
                'utf8',
              )
            : RNFS.existsAssets(`data/files/${filename}`, 'utf8');
        readNodeData.then((result) => {
          if (result) {
            RNFetchBlob.fs
              .cp(RNFetchBlob.fs.asset(`data/files/${filename}`), PATH_OF_FILE)
              .then((res) => {
                FileViewerApp(PATH_OF_FILE);
              })
              .catch((err) => {
                // console.log('already copied');
              });
          } else {
            // console.log('File in Assets');
          }
        });
      }
    })
    .catch((err) => {
      // console.log(err, 'err::');
    });

  FileViewerApp = (PATH_OF_FILE) => {
    FileViewer.open(PATH_OF_FILE)
      .then((suc) => {})
      .catch((error) => {
        Alert.alert(
          'Notification',
          'please ensure that you have correct format to open the doc',
          [
            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            {text: 'Ok', onPress: () => {}, style: 'cancel'},
          ],
          {cancelable: false},
        );
      });
  };
}
