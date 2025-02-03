import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Theme from '../styles/Theme';
import {navigateHelper} from '../utils/navigations/navigationHelper';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import FooterContainer from './Footer';
import DeviceInfo from 'react-native-device-info';
import {LANGUAGES} from '../constants';
const isTablet = DeviceInfo.isTablet();
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class SquareMenuTwo extends Component {
  constructor(props) {
    super(props);
    this._navigate = this._navigate.bind(this);
  }

  _navigate = menu => {
    const {navigation, state, nodeMap, route} = this.props;
    const {isDrawer} = route.params;
    var data = menu && menu;
    if (isDrawer) {
      data = menu.deeperlink && menu.deeperlink && menu.deeperlink[0];
    }
    navigateHelper(data, navigation, nodeMap);
  };

  renderItem = element => {
    const {item, index} = element;
    const backgroundColors = [
      ['#45b3f3', '#41a7e7', '#3a92d2', '#408dcb'],
      ['#84a5d8', '#6a87c1', '#4f78b6', '#2060a8'],
    ];
    const images = [
      require('../assets/guidelines/openedBook.png'),
      require('../assets/guidelines/openedBook.png'),
    ];
    return (
      <TouchableOpacity
        onPress={() => this._navigate(item)}
        style={styles.titleContainer}>
        <LinearGradient
          style={styles.menu}
          start={{x: 1, y: 0.1}}
          end={{x: 1, y: 1}}
          colors={backgroundColors[index]}
          key={`linear_gradient_container_${index}`}>
          <View style={styles.mainContainer}>
            <View style={styles.leftContainer}>
              <Icon name="arrow-right-l" style={styles.icon} />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Image style={styles.bookImg} source={images[index]} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  render() {
    const {navigation, route, nodeMap} = this.props;
    const {data} = route.params;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {data && data.deeperlink && data.deeperlink.length ? (
            <View style={styles.container}>
              {data.deeperlink &&
              Array.isArray(data.deeperlink) &&
              data.deeperlink.length ? (
                <View>
                  <FlatList
                    data={data.deeperlink}
                    renderItem={(item, idx) => this.renderItem(item, idx)}
                    keyExtractor={item => item.title}
                  />
                </View>
              ) : null}
            </View>
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{textAlign: 'center', color: 'black'}}>
                {LANGUAGES[0].noContentLabel}
              </Text>
            </View>
          )}
        </View>
        <FooterContainer {...this.props} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  leftContainer: {
    fontSize: wp('15%'),
    width: isTablet ? wp('71%') : wp('65%'),
    color: 'white',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: isTablet ? wp('3.3%') : wp('4.6%'),
    color: 'white',
    marginLeft: wp('6%'),
    marginRight: wp('2%'),
    fontFamily: Theme.fonts.regular,
  },
  menu: {
    flexDirection: 'row',
    height: hp('35%'),
    justifyContent: 'center',
    width: wp('90%'),
    borderRadius: wp('5%'),
    marginTop: isTablet ? wp('3.5%') : wp('4%'),
  },
  icon: {
    marginTop: 10,
    marginLeft: wp('6%'),
    color: 'white',
    fontSize: isTablet ? wp('5%') : wp('6.5%'),
    paddingBottom: wp('2.5%'),
  },
  rightContainer: {
    width: isTablet ? wp('17%') : wp('25%'),
    height: hp('15%'),
    borderRadius: wp('3%'),
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bookImg: {
    width: wp('25%'),
    height: hp('7%'),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
const getMainMenuLists = menuState => {
  if (menuState.data && menuState.data.menu.entities.data) {
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

const mapStateToProps = state => {
  return {
    mainMenuLists: getMainMenuLists(state.menus),
    nodeMap: state.nodeMap.nodeMap,
  };
};

export default connect(mapStateToProps)(SquareMenuTwo);
