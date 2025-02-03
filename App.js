import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store/store';
import {
  StyleSheet,
  View,
  Dimensions,
  LogBox,
  Alert,
  AppState,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import showUpgradeDialogBox from './src/utils/upgradeApp';
import * as types from './src/redux/actionTypes'
import { SnackProvider } from 'react-native-snackbar-material';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
var dummyDeepLinkedUrl;
LogBox.ignoreAllLogs();
const { width } = Dimensions.get('window');
 
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    SplashScreen.hide();
    showUpgradeDialogBox();
      this.requestNotificationPermission();
      this.requestUserPermission();
      this.notificationListener();
  }
  async requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus==1) {
      this.getFCMToken(); 
    }
  }
  requestNotificationPermission = async () => {
    
    if (Platform.OS === 'android' && Platform.Version>=33) {
      const permissionStatus = await AsyncStorage.getItem(
        'ANDROID_PERMISSION_STATUS',
      );
      if (!permissionStatus || permissionStatus !== 'true') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await AsyncStorage.setItem('ANDROID_PERMISSION_STATUS', 'true');
          } else {
            await AsyncStorage.setItem('ANDROID_PERMISSION_STATUS', 'false');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }
  };
  getFCMToken = async () => {
    let checkToken = await AsyncStorage.getItem('fcmToken');

    if (!checkToken) {
      try {
        const fcmToken = await messaging().getToken();
        //console.log('fcmToken', fcmToken)
        if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      } catch (error) {
        alert('Kindly Check Your Internet Connection');
      }
    }
  };
  notificationListener = async () => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
      this._handleOpenURLNotificationFurther(remoteMessage.data.deeplink);
    });

    messaging().onMessage(async remoteMessage => {
      const permissionStatus = await AsyncStorage.getItem(
        'ANDROID_PERMISSION_STATUS',
      );
      const authorizationStatus = await messaging().requestPermission();
      if (Platform.OS === 'android' && (permissionStatus==='true'|| Platform.Version<33)) {
        PushNotification.createChannel({
          channelId: 'whovmmc',
          channelName: 'My channel',
        });
        PushNotification.localNotification({
          channelId: 'whovmmc',
          message: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          smallIcon: 'ic_stat_ic_notification',
          largeIcon: 'ic_launcher',
          color: '#F28C1F',
          invokeApp: true,
          ignoreInForeground:true
        });
        this.asyncAlert(remoteMessage.data.deeplink);
      } else if(authorizationStatus==1 && Platform.OS=='ios'){
        this.asyncAlert(remoteMessage.data.deeplink);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
          this.asyncAlert(remoteMessage.data.deeplink);
      });
  };
  asyncAlert = message => {
    let title = 'You have Received one Notification, Do you want to read it';
    Alert.alert(
      'Notification',
      title,
      [
        {
          text: 'Read',
          onPress: () => this._handleOpenURLNotificationFurther(message),
        },
        {text: 'Cancel', onPress: () => {}},
      ],
      {cancelable: false},
    );
  };

  /* Navigate to related content from shared url */
  _handleOpenURLNotificationFurther = (url) => {
    const route = url.replace(/.*?:\/\//g, '');
    const params = route.split('/');
    store.dispatch({
      type: types.SET_SHARED_CONTENT_NODE,
      url: url,
      
    });
    dummyDeepLinkedUrl = url;
  };

  
  componentWillUnmount() { 
  }

  render() {
    return (
      <Provider store={store}>
        <SnackProvider>
          <PersistGate loading={null} persistor={persistor}>
            <View style={styles.container}>
              <AppNavigator />
            </View>
          </PersistGate>
        </SnackProvider>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    width: width,
    paddingVertical: 5,
    position: 'absolute',
    bottom: 50,
  },
});

export default App;
