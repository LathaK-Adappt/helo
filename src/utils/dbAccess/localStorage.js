// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const deviceVersion = DeviceInfo.getVersion()
const deviceNumber = DeviceInfo.getBuildNumber();

class LocalStorage {
  setItem = (key, data) => {
    AsyncStorage.setItem(key.toString(), JSON.stringify(data), (err, d) => {
      if (err) {
        return err
      }
      return true
    });
  }
  getItem = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key.toString());
      return JSON.parse(data);
    } catch (err) {
      return err
    }
  }
  removeItem = async (key) => {
    try {
      return await AsyncStorage.removeItem(key.toString());
    } catch (err) {
      return err
    }
  }

  saveVersion = async (languageCode, data) => {
    let vData = {
      device_number: data.device_number,
      device_version: data.device_version,
      language: languageCode,
      version: data ? data.version : null
    }
    return await this.setItem(`version_${languageCode}`, vData);
  }
  getVersion = async (languageCode) => {
    return await this.getItem(`version_${languageCode}`);
  }
}

export default new LocalStorage();