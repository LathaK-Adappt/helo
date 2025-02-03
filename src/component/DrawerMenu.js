import React, {Component} from 'react';
import {
  Platform,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FeatherIcons from 'react-native-vector-icons/Feather';
import DeviceInfo from 'react-native-device-info';
import {connect} from 'react-redux';
import Theme from '../styles/Theme';
import {navigateHelper} from '../utils/navigations/navigationHelper';
import {LANGUAGES} from '../constants/';
const isTablet = DeviceInfo.isTablet();
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

var RNFS = require('react-native-fs');
const {width} = Dimensions.get('window');
const Images = {
  0: require('../assets/icons/1.png'),
  1: require('../assets/icons/2.png'),
  2: require('../assets/icons/3.png'),
  3: require('../assets/icons/search.png'),
  4: require('../assets/icons/fav.png'),
};

class DrawerMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {isLanguageMenu: '', isTick: 0, isRecommendationMenu: false};
  }

  onNavigate = menu => {
    const {navigation, nodeMap} = this.props;
    if (menu.deeperlink && menu.deeperlink.length > 0) {
      const data = menu.deeperlink[0].deeperlink ? menu : menu.deeperlink[0];
      data['headerTitle'] = menu.title && menu.title ? menu.title : '';
      if (data.menu_type == 'menu_squares') {
        navigation.navigate('SquareMenu', {data, isDrawer: true});
      } else {
        navigateHelper(data, navigation, nodeMap);
      }
    }
  };

  recommendationList() {
    const {menus} = this.props;
    return (
      <>
        {menus &&
          menus.map((menu, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => this.onNavigate(menu)}
                style={styles.menuTitleTextContainer}>
                <View style={styles.menuItemContainer}>
                  <View style={{flexDirection: 'row', alignItems: 'center', minHeight:50}}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image source={Images[index]} style={styles.icon} />
                    </View>
                    <Text style={styles.toolBarTitle} numberOfLines={2}>
                      {menu.title}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}>
                    <SimpleLineIcons
                      name="arrow-right"
                      size={12}
                      color={Theme.customColor.primaryColor}
                      style={styles.righticon}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Search');
          }}
          style={styles.menuTitleTextContainer}>
          <View style={styles.menuItemContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', minHeight:50}}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {
                  <Image
                    source={Images[3] ? Images[3] : ''}
                    style={styles.icon}
                  />
                }
              </View>
              <Text style={styles.toolBarTitle} numberOfLines={2}>
                Search
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <SimpleLineIcons
                name="arrow-right"
                size={12}
                color={Theme.customColor.primaryColor}
                style={styles.righticon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Favourites');
          }}
          style={styles.menuTitleTextContainer}>
          <View style={styles.menuItemContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center',minHeight:50}}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {
                  <Image
                    source={Images[4] ? Images[4] : ''}
                    style={styles.icon}
                  />
                }
              </View>
              <Text style={styles.toolBarTitle} numberOfLines={2}>
                Favorite
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <SimpleLineIcons
                name="arrow-right"
                size={12}
                color={Theme.customColor.primaryColor}
                style={styles.righticon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.menuTitleTextContainer} key="version">
          <View style={styles.leftContainerTwo}>
            <SimpleLineIcons
              name="info"
              size={21}
              color={Theme.customColor.black}
            />
          </View>
          <View style={styles.versionText}>
            <Text style={styles.toolBarTitle}>
              {LANGUAGES[0].version} {DeviceInfo.getVersion()} (
              {DeviceInfo.getBuildNumber()})
            </Text>
          </View>
        </View>
      </>
    );
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.drawerMenuContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              this.state.isLanguageMenu == ''
                ? navigation.closeDrawer()
                : this.setState({isLanguageMenu: ''});
            }}
            style={styles.leftContainer}>
            <Icon
              style={{
                paddingHorizontal: 16,
                marginTop: Platform.OS == 'ios' ? 30 : 0,
                paddingTop: Platform.OS == 'ios' ? 10 : 0,
              }}
              name="arrow-left"
              size={25}
              color="#ffff"
            />
          </TouchableOpacity>
          <View style={styles.rightContainer}>
            <Text style={styles.menuTitle}>
              {this.state.isLanguageMenu == ''
                ? LANGUAGES[0].quickMenu.toUpperCase()
                : this.state.isLanguageMenu == 'language'
                ? LANGUAGES[0].secondaryLabel.toUpperCase()
                : LANGUAGES[0].recommendation.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.containerTwo}>{this.recommendationList()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerMenuContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    width: width - 40,
    height: Platform.OS == 'ios' ? hp('15%') : hp('7%'),
    backgroundColor: '#016ab6',
  },
  leftContainer: {
    justifyContent: 'center',
  },
  rightContainer: {
    justifyContent: 'center',
    paddingLeft: wp('8%'),
    marginTop: Platform.OS == 'ios' ? 30 : 0,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffff',
    paddingTop: Platform.OS == 'ios' ? 10 : 0,
    fontFamily: Theme.fonts.regular,
  },
  menulistContainer: {
    height: hp('100%'),
    width: wp('90%'),
  },
  menuTitleTextContainer: {
    height: Platform.OS == 'ios' ? 65 : hp('8%'),
    borderBottomColor: '#999',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'flex-end',
    width: wp('15%'),
  },
  titleText: {
    width: wp('50%'),
    fontSize: 18,
    marginLeft: wp('5%'),
  },
  row: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    paddingRight: 15,
  },
  leftContainerTwo: {
    justifyContent: 'center',
    paddingLeft: wp('4%'),
    width: wp('11%'),
  },
  menuItemContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  toolBarTitle: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: Theme.fonts.medium,
    width: wp('60%'),
    marginLeft: wp('3%'),
         // textTransform: 'uppercase',
    color: '#494949',
      },
  icon: {
    width: isTablet ? 32 : 22,
    height: isTablet ? 32 : 22,
    resizeMode: 'contain',
    tintColor: '#797979',
  },
});

const getMenuLists = menuState => {
  if (
    menuState.data &&
    menuState.data.menu &&
    menuState.data.menu.entities.data
  ) {
    return Object.keys(menuState.data.menu.entities.data)
      .map((a, b) => {
        return menuState.data.menu.entities.data[a];
      })
      .sort((a, b) => {
        return a.weight - b.weight;
      });
  } else {
    return [];
  }
};

const getMainMenuLists = menuState => {
  // if (menuState.data &&  menuState.data.menu.entities.data) {
  //   return Object.keys( menuState.data.menu.entities.data)
  //     .map((a, b) => {
  //       return  menuState.data.menu.entities.data;
  //     })
  //     .sort((a, b) => {
  //       return a.weight - b.weight;
  //     });
  // } else {
  //   return [];
  // }
};

const mapStateToProps = state => {
  return {
    menus: getMenuLists(state.menus),
    mainMenuLists: getMainMenuLists(state.menus),
  };
};

export default connect(mapStateToProps)(DrawerMenu);
