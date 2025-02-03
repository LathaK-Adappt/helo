import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {navigateHelper} from '../utils/navigations/navigationHelper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FooterContainer from './Footer';
import Theme from '../styles/Theme';
import DeviceInfo from 'react-native-device-info';
import {LANGUAGES} from '../constants';
const isTablet = DeviceInfo.isTablet();
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class SquareMenu extends Component {
  constructor(props) {
    super(props);
    this._navigate = this._navigate.bind(this);
  }
  _navigate = data => {
    const {navigation, nodeMap} = this.props;
    switch (data.menu_type) {
      case 'menu_list':
      case 'content':
      case 'content-menulist':
        navigateHelper(data, navigation, nodeMap);
        break;
      case 'menu_squares':
        navigation.navigate('SquareMenuTwo', {data, isDrawer: false});
        break;
      default:
        break;
    }
  };
  renderItem = element => {
    const {item, index} = element;
    return (
      <TouchableOpacity
        onPress={() => this._navigate(item)}
        key={index}
        style={styles.squareItem}>
        <View style={styles.squareBlock}>
          <View style={styles.leftContainer}>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.triangle} />
            <AntDesign name="right" size={16} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const {route} = this.props;
    const {data} = route.params;
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#016ab6" barStyle="light-content" />
        <View style={{flex: 1}}>
          {data.deeperlink &&
          Array.isArray(data.deeperlink) &&
          data.deeperlink.length ? (
            <FlatList
              data={data.deeperlink}
              renderItem={(item, idx) => this.renderItem(item, idx)}
              keyExtractor={item => `key_${item.nid}`}
              ListFooterComponent={<View style={{marginBottom: 15}} />}
            />
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
  squareItem: {
    borderRadius: 15,
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 18,
    marginHorizontal: 15,
    shadowColor: 'rgba(0,0,0,.3)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  squareBlock: {
    paddingLeft: 15,
    flexDirection: 'row',
    borderRadius: 15,
    overflow: 'hidden',
    height: 85,
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: isTablet ? wp('3.8%') : wp('4.2%'),
    fontFamily: Theme.fonts.medium,
    color: '#494949',
  },
  rightContainer: {
    width: 70,
    backgroundColor: '#d76321',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 35,
    borderTopWidth: 85,
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
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

export default connect(mapStateToProps)(SquareMenu);
