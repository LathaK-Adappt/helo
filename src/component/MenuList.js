import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Theme from '../styles/Theme';
import {navigateHelper} from '../utils/navigations/navigationHelper';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import FooterContainer from './Footer';
import DeviceInfo from 'react-native-device-info';
import {LANGUAGES} from '../constants';
const isTablet = DeviceInfo.isTablet();
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class MenuList extends Component {
  constructor(props) {
    super(props);
    this._navigate = this._navigate.bind(this);
  }

  _navigate = data => {
    const {navigation, state, nodeMap} = this.props;
    navigateHelper(data, navigation, nodeMap);
  };

  renderItem = element => {
    const {item, index} = element;
    return (
      <TouchableOpacity
        onPress={() => this._navigate(item)}
        style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    );
  };
  renderSeparatorView = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CEDCCE',
        }}
      />
    );
  };

  render() {
    const {navigation, route, nodeMap} = this.props;
    const {data} = route.params;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {data && data.deeperlink && data.deeperlink.length ? (
            <LinearGradient
              start={{x: 1, y: 0.1}}
              end={{x: 0.01, y: 0.9}}
              colors={['#16618a', '#289bd4']}
              style={styles.container}>
              {data.deeperlink &&
              Array.isArray(data.deeperlink) &&
              data.deeperlink.length ? (
                <View style={{flex: 1, marginTop: 5, marginBottom: 15}}>
                  <FlatList
                    data={data.deeperlink}
                    renderItem={(item, idx) => this.renderItem(item, idx)}
                    keyExtractor={item => item.title}
                    ItemSeparatorComponent={this.renderSeparatorView}
                  />
                </View>
              ) : null}
            </LinearGradient>
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
  },
  titleContainer: {
    borderBottomWidth: isTablet ? 0.3 : 0.2,
    borderColor: 'white',
  },
  title: {
    fontSize: isTablet ? wp('3.3%') : wp('4%'),
    color: 'white',
    marginLeft: wp('6%'),
    padding: wp('4%'),
    fontFamily: Theme.fonts.regular,
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

export default connect(mapStateToProps)(MenuList);
