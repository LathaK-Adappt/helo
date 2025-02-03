import { Platform, Linking, Alert } from "react-native";
import DeviceInfo from "react-native-device-info";
import { APP_UPGRADE_URL, STORE_URL } from "../constants/serverAPIS";

const compareAppVersion = (v1, v2) => {
  if (typeof v1 !== "string") return false;
  if (typeof v2 !== "string") return false;
  v1 = v1.split(".");
  v2 = v2.split(".");
  const k = Math.min(v1.length, v2.length);
  for (let i = 0; i < k; ++i) {
    v1[i] = parseInt(v1[i], 10);
    v2[i] = parseInt(v2[i], 10);
    if (v1[i] > v2[i]) return false;
    if (v1[i] < v2[i]) return true;
  }
  return v1.length == v2.length ? false : v1.length < v2.length ? true : false;
};

const attemptUpgrade = () => {
  Linking.canOpenURL(
    Platform.OS === "ios" ? STORE_URL.appStoreURL : STORE_URL.playStoreURL
  ).then((supported) => {
    if (supported) {
      Linking.openURL(
        Platform.OS === "ios" ? STORE_URL.appStoreURL : STORE_URL.playStoreURL
      );
    }
  });
};

const renderAlert = () => {
  Alert.alert(
    `Update Available`,
    `There is an updated version available. Would you like to upgrade?`,
    [{ text: "Cancel" }, { text: "Upgrade", onPress: () => attemptUpgrade() }],
    { cancelable: false }
  );
};

const upgradeDialogBox = () => {
  fetch(APP_UPGRADE_URL, {
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (
        Platform.OS === "ios" &&
        data.iosVersion &&
        compareAppVersion(DeviceInfo.getVersion(), data.iosVersion)
      ) {
        renderAlert();
      } else {
        if (
          Platform.OS === "android" &&
          data.androidVersion &&
          compareAppVersion(DeviceInfo.getVersion(), data.androidVersion)
        ) {
          renderAlert();
        }
      }
    });
};

export default upgradeDialogBox;
