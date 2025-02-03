import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import Theme from '../styles/Theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
const backProp =
  Platform.OS === 'ios' ? null : TouchableNativeFeedback.SelectableBackground();

const FooterContainer = props => {
  const {navigation} = props;
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity
        style={styles.footerMenu}
        background={backProp}
        key="menu"
        onPress={() => {
          navigation.openDrawer();
        }}>
        <Image
          style={styles.footerIcon}
          source={require('../assets/footer-icons/icn-menu.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerMenu}
        background={backProp}
        key="MalariaReportHome"
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <Image
          style={styles.footerIcon}
          source={require('../assets/footer-icons/icn-house.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerMenu}
        background={backProp}
        key="Favourites"
        onPress={() => navigation.navigate('Favourites')}>
        <Image
          style={styles.footerIcon1}
          source={require('../assets/footer-icons/icn-heart.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerMenu}
        background={backProp}
        key="QuickStats"
        onPress={() => {
          navigation.navigate('Search', {title: 'Search'});
        }}>
        <Image
          style={styles.footerIcon}
          source={require('../assets/footer-icons/icn-search.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: isTablet ? 75 : 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  footerMenu: {
    flex: 1,
    alignItems: 'center',
  },
  footerIcon: {
    alignSelf: 'center',
    width: isTablet ? 25 : 20,
    height: isTablet ? 25 : 20,
    tintColor: '#202020',
  },
  footerIcon1: {
    alignSelf: 'center',
    width: isTablet ? 28 : 22,
    height: isTablet ? 25 : 20,
    tintColor: '#202020',
  },
});

export default FooterContainer;
