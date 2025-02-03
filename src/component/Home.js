/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import Theme from '../styles/Theme';
import creator from '../redux/actionCreators';
import LinearGradient from 'react-native-linear-gradient';
import {navigateHelper} from '../utils/navigations/navigationHelper';
import FooterContainer from './Footer';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import CarouselComponent from './Carousel';

const isTablet = DeviceInfo.isTablet();
let {width} = Dimensions.get('window');

const tileicon = {
  0: require('../assets/icons/1.png'),
  1: require('../assets/icons/2.png'),
  2: require('../assets/icons/3.png'),
  search: require('../assets/icons/search.png'),
  fav: require('../assets/icons/fav.png'),
};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    this.props.startSync();
    this.dummyDeepLinkedUrl = true;

    Linking.addEventListener('url', this._handleOpenURL.bind(this));
    Linking.getInitialURL().then(url => {
      if (url) {
        this._handleOpenURLFurther(url);
      }
    });
  };
  componentDidUpdate(nextProps) {
    if (this.dummyDeepLinkedUrl && this.props.url) {
      const url = this.props.url;
      this._handleOpenURLFurther(url);
    }
  }

  _handleOpenURL(event) {
    this._handleOpenURLFurther(event.url);
  }

  /* Navigate to related content from shared url */
  _handleOpenURLFurther = url => {
    const route = url.replace(/.*?:\/\//g, '');
    const params = route.split('/');
    const nodeID =
      typeof params[0] === 'string' ? Number(params[0]) : params[0];
    const parentNodeID =
      typeof params[0] === 'string' ? Number(params[1]) : params[1];
    if (nodeID && this.props && this.props.nodeMap) {
      let {navigation, nodeMap} = this.props;
      let data = nodeMap[nodeID];
      if (data === undefined && parentNodeID) {
        let deeperLinkData = nodeMap[parentNodeID].deeperlink;
        let nodeFeedData = deeperLinkData.filter(d => d.nid === nodeID);
        data = nodeFeedData[0];
      }
      this.dummyDeepLinkedUrl = false;
      navigateHelper(data, navigation, nodeMap);
    }
  };
  componentWillUnmount() {
    Linking.removeAllListeners('url', this._handleOpenURL.bind(this));
  }

  navigateToRelatedComponent = value => {
    switch (value.menu_type) {
      case 'menu_list':
        this.dummyDeepLinkedUrl = true;
        navigateHelper(value, this.props.navigation, this.props.nodeMap);
        break;
      case 'menu_squares':
        this.dummyDeepLinkedUrl = true;
        navigateHelper(value, this.props.navigation, this.props.nodeMap);
        break;
      case 'content':
        this.dummyDeepLinkedUrl = true;
        navigateHelper(value, this.props.navigation, this.props.nodeMap);
        break;
      default:
        break;
    }
  };

  render() {
    const {navigation, nodeMap, carouselTags} = this.props;
        return (
      <>
        <StatusBar backgroundColor="#16618a" barStyle="light-content" />
        <View style={{flex: 1, zIndex:999}}>
          <LinearGradient
            start={{x: 1, y: 0.1}}
            end={{x: 0.01, y: 0.9}}
            colors={['#16618a', '#289bd4']}
            style={{
              ...styles.container,
              flex: carouselTags?.isHomeAvail ? 0.65 : 1,
            }}>
            <Image
              source={require('../assets/header_bg.png')}
              style={styles.headerBg}
            />
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>WHO HIV TX</Text>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.logo}
                />
              </View>
            </View>
            <View style={styles.containerTwo}>
              <View style={styles.tileBlock}>
                {this.props.menuLists &&
                Array.isArray(this.props.menuLists) &&
                this.props.menuLists.length ? (
                  this.props.menuLists.map((item, idx) => {
                    return (
                      <TouchableOpacity
                        onPress={() => this.navigateToRelatedComponent(item)}
                        key={item.title}
                        style={styles[`menu${idx}`]}>
                        <ImageBackground
                          source={require('../assets/tilebg.jpg')}
                          style={styles.imageBg}
                        />
                        <Image
                          source={tileicon[idx]}
                          style={styles[`tileIcon${idx}`]}
                        />
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        <Image
                          source={require('../assets/tile_arrow.png')}
                          style={styles.tileArrow}
                        />
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={{justifyContent: 'center',alignItems: 'center',flex: 1}}>
                  <Text style={{color:'#fff',fontSize:18}}>Loading...</Text>
                  </View>
                )}
                {!carouselTags ? null : carouselTags.isHomeAvail ? null : (
                  <>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Search')}
                      style={styles.menu2}>
                      <ImageBackground
                        source={require('../assets/tilebg.jpg')}
                        style={styles.imageBg}
                      />
                      <Image
                        source={tileicon.search}
                        style={styles.tileIcon0}
                      />
                      <Text style={styles.menuTitle}>Search</Text>
                      <Image
                        source={require('../assets/tile_arrow.png')}
                        style={styles.tileArrow}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Favourites')}
                      style={styles.menu1}>
                      <ImageBackground
                        source={require('../assets/tilebg.jpg')}
                        style={styles.imageBg}
                      />
                      <Image source={tileicon.fav} style={styles.tileIcon0} />
                      <Text style={styles.menuTitle}>Favourites</Text>
                      <Image
                        source={require('../assets/tile_arrow.png')}
                        style={styles.tileArrow}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </LinearGradient>
          <FooterContainer {...this.props} />
          {this.props.showSyncStatus && (
            <View
              style={[
                styles.statusBar,
                {backgroundColor: this.props.statusColor},
              ]}>
              <Text style={styles.toastText}>{this.props.syncStatus}</Text>
            </View>
          )}


          {carouselTags?.isHomeAvail ? (
            <View
              style={{
                backgroundColor: '#2f6595',
                ...StyleSheet.absoluteFillObject,
              }}>
              <View style={styles.carouselContainer}>
                <CarouselComponent
                  data={carouselTags?.isHomeItems}
                  nav={navigation}
                  nodeMap={nodeMap}
                />
              </View>
              <View>
                <FooterContainer {...this.props} />
              </View>
            </View>
          ) : null}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 0.6,
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    zIndex: 99,
  },
  imageBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    opacity: 0.08,
  },
  headerBg: {
    position: 'absolute',
    width: width / 2.4,
    height: width / 2.1,
    right: 0,
    top: 0,
    resizeMode: 'cover',
  },
  titleContainer: {
    paddingTop: hp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  logo: {
    width: isTablet ? 80 : 50,
    resizeMode: 'contain',
  },
  title: {
    fontSize: isTablet ? wp('7.5%') : wp('8.7%'),
    color: 'white',
    fontWeight: 'bold',
    fontFamily: Theme.fonts.medium,
  },
  containerTwo: {
    flex: 1,
    justifyContent: 'center',
  },
  tileBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 15,
  },
  menu0: {
    flexDirection: 'column',
    height: hp('19%'),
    width: isTablet ? wp('95%') : wp('100%') - 30,
    borderRadius: wp('3.5%'),
    marginTop: isTablet ? 15 : 10,
    marginBottom: isTablet ? 15 : 10,
    backgroundColor: 'rgba(26, 67, 105, .7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  menu1: {
    flexDirection: 'column',
    height: hp('18%'),
    width: isTablet ? wp('95%') / 2 - 10 : wp('100%') / 2 + 10,
    borderRadius: wp('3.5%'),
    marginTop: 15,
    marginBottom: isTablet ? 15 : 10,
    backgroundColor: 'rgba(26, 67, 105, .7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  menu2: {
    flexDirection: 'column',
    height: hp('18%'),
    width: isTablet ? wp('95%') / 2 - 10 : wp('80%') / 2 - 20,
    borderRadius: wp('3.5%'),
    marginTop: 15,
    marginBottom: isTablet ? 15 : 10,
    backgroundColor: 'rgba(26, 67, 105, .7)',
    borderWidth: 1,
    borderColor: 'rgba(66, 66, 100, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileIcon0: {
    width: 40,
    height: 40,
    marginVertical: 20,
    paddingVertical: 20,
    resizeMode: 'contain',
  },
  tileIcon1: {
    width: 40,
    height: 40,
    marginVertical: 20,
    top: 10,
    resizeMode: 'contain',
  },
  tileIcon2: {
    width: 40,
    height: 40,
    marginVertical: 20,
    paddingVertical: 20,
    resizeMode: 'contain',
  },
  tileArrow: {
    position: 'absolute',
    right: 15,
    bottom: 2,
    width: 18,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  menuTitle: {
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: wp('5%'),
    fontFamily: Theme.fonts.medium,
    textAlign: 'center',
    marginBottom: 30,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
  },
  statusBar: {
    height: 25,
    position: 'absolute',
    bottom: isTablet ? 60 : 45,
    width: '100%',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
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

function filterByIsHome(data) {
  const result = [];
  let isHomeAvail = false;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const item = data[key];
      const ishome = item.deeperlink?.some(itm => itm.is_home === 1);
      if (item && ishome) {
        isHomeAvail = true;
        item.deeperlink
          .filter(itm => itm.is_home === 1)
          .map(itm => result.push(itm));
      }
    }
  }
  return {
    isHomeAvail: isHomeAvail,
    isHomeItems: result,
  };
}

const getCarouselData = carouselData => {
  if (
    carouselData &&
    carouselData.data &&
    carouselData.data.menulist &&
    carouselData.data.menulist.entities
  ) {
    try {
      const obj = carouselData.data.menulist.entities.data;
      const menulist = filterByIsHome(obj);
      return menulist;
    } catch (error) {
      console.log('error', error);
    }
  }
  // const obj2 = carouselData.data.menusquareslist.entities.data;
};

const mapStateToProps = state => {
  // console.log(state,'state')
  return {
    menuLists: getMenuLists(state.menus),
    languageCode: state.appState.language,
    nodeMap: state.nodeMap.nodeMap,
    showSyncStatus: state.appState.showSyncStatus,
    syncStatus: state.appState.syncStatus,
    statusColor: state.appState.color,
    url: state.shareNode.url,
    carouselTags: getCarouselData(state.menus),
    carouselList: state.menus,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    startSync: () => dispatch(creator.startSync()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
