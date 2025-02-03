import React, {Component} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import StoryView from './StoryView/StoryView';
import * as types from '../redux/actionTypes';
import {navigateHelper} from '../utils/navigations/navigationHelper';
import creator from '../redux/actionCreators';
import Carousel from 'react-native-looped-carousel';
import FooterContainer from './Footer';
import Theme from '../styles/Theme';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../redux/store/store';
import S from '../utils/string';

var {width, height} = Dimensions.get('window');

class CarousalView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevData: null,
      nextData: null,
      parent: null,
      actualSwipeArray: [],
      size: {width, height},
      data: [],
      breadCrumsElementArray: [],
      parentId: null,
      showBreadCrumb: true,
      nav: this.props.navigation,
      limitedSwipeArray: [],
    };
    this.counter = 0;
    this.currentIndex = 0;
    this.swipeToPrev = true;
    this.swipeToNext = true;
    this._renderItem = this._renderItem.bind(this);
    this.onSwipeChange = this.onSwipeChange.bind(this);
    this.renderBreadCrumb = this.renderBreadCrumb.bind(this);
  }

  componentWillMount() {
    store.dispatch({type: types.SET_SHARED_CONTENT_NODE, url: null});
    let {route} = this.props;
    let {myParams} = route && route.params.params ? route.params.params : {};
    var nid = myParams.nid;
    var nodeMap = this.props.nodeMap;
    var swipeArrayNodes = this.props.swipeArrayNodes;
    var nidPosition = swipeArrayNodes.indexOf(nid);
    var actualSwipeArray = [];
    this.counter = nidPosition;
    if (nidPosition === 0) {
      actualSwipeArray[0] = swipeArrayNodes[0];
      actualSwipeArray[1] = swipeArrayNodes[1];
      actualSwipeArray[2] = swipeArrayNodes[swipeArrayNodes.length - 1];
      this.swipeToPrev = false;
    } else if (nidPosition === swipeArrayNodes.length - 1) {
      actualSwipeArray[0] = swipeArrayNodes[0];
      actualSwipeArray[1] = swipeArrayNodes[nidPosition - 1];
      actualSwipeArray[2] = swipeArrayNodes[nidPosition];
      this.swipeToNext = false;
    } else {
      actualSwipeArray[0] = swipeArrayNodes[nidPosition - 1];
      actualSwipeArray[1] = swipeArrayNodes[nidPosition];
      actualSwipeArray[2] = swipeArrayNodes[nidPosition + 1];
      this.swipeToNext = true;
      this.swipeToPrev = true;
    }
    this.counter = nidPosition;
    var nodeUpdateInfoMap = [];
    var updateInfo = [];
    var nidNodeData = nodeMap[nid];
    this.currentIndex = actualSwipeArray.indexOf(nid);
    var itemData = nodeMap[actualSwipeArray[this.currentIndex]];
    var menu_type = itemData.menu_type;
    var parent_nid = itemData.parent_nid;

    if (menu_type !== 'news_feed') {
      var bred = [];
      var parent_nid_array = [nid, parent_nid];
      do {
        var parent_data = nodeMap[parent_nid];
        if (parent_data !== undefined) {
          parent_nid = parent_data.parent_nid;
          if (nodeMap[parent_nid] !== undefined) {
            parent_nid_array.push(parent_nid);
          }
        } else {
          parent_nid = undefined;
        }
      } while (parent_nid !== undefined);
      bred = parent_nid_array;
      this.setState({showBreadCrumb: true, breadCrumsElementArray: bred});
    } else {
      this.setState({showBreadCrumb: false});
    }
    this.setState({
      actualSwipeArray,
    });
  }

  _renderItem(item, index) {
    let {route} = this.props;
    let {myParams} = route && route.params.params ? route.params.params : {};
    var nodeMap = this.props.nodeMap;
    var itemData = nodeMap[item];
    var menu_type = itemData.menu_type;
    var breadCrumsElementArray = this.state.breadCrumsElementArray;
    var searchText = myParams.searchText;
    switch (menu_type) {
      case 'content':
      case 'content-menulist':
      case 'mirror_content':
      case 'decision_tree':
      case 'accord':
        return (
          <StoryView
            tags={this.props.tags}
            languageCode={this.props.languageCode}
            addFavourite={this.props.addFavourite}
            removeFavourite={this.props.removeFavourite}
            favourites={this.props.favourites}
            paramNid={myParams.nid}
            key={index}
            nid={
              itemData.menu_type === 'mirror_content'
                ? itemData.original_content
                : item
            }
            nodeMap={nodeMap}
            itemData={itemData}
            navigation={this.state.nav}
            breadCrumsElementArray={breadCrumsElementArray}
            searchText={searchText}
          />
        );
      default:
        return null;
    }
  }

  navigateFromBreadCrumb(index, nav, nodeMap, breadCrumsElementArray) {
    var selectedNid = breadCrumsElementArray[index];
    var data = nodeMap[selectedNid];
    if (
      data.menu_type === 'menu_squares' &&
      data.deeperlink[0]?.menu_type === 'menu_list'
    ) {
      nav.navigate('SquareMenu', {data, isDrawer: false});
    } else {
      navigateHelper(data, nav, nodeMap, false, null);
    }
  }

  onSwipeChange(index) {
    var swipeArrayNodes = this.props.swipeArrayNodes;
    var actualSwipeArray = this.state.actualSwipeArray;

    var selectedItem = this.state.actualSwipeArray[index];
    var arr_index = swipeArrayNodes.indexOf(selectedItem); //2
    var mini_arr_index = actualSwipeArray.indexOf(selectedItem); //2

    function getOffset(swipeArrayNodes, index, offset) {
      return swipeArrayNodes[
        (swipeArrayNodes.length + index + (offset % swipeArrayNodes.length)) %
          swipeArrayNodes.length
      ];
    }

    var prev_id = getOffset(swipeArrayNodes, arr_index, -1);
    var next_id = getOffset(swipeArrayNodes, arr_index, 1);
    switch (mini_arr_index) {
      case 0:
        actualSwipeArray[2] = prev_id;
        actualSwipeArray[1] = next_id;
        break;
      case 1:
        actualSwipeArray[0] = prev_id;
        actualSwipeArray[2] = next_id;
        break;
      case 2:
        actualSwipeArray[1] = prev_id;
        actualSwipeArray[0] = next_id;
        break;
      default:
        break;
    }
    this.currentIndex = index;
    var nodeMap = this.props.nodeMap;
    var itemData = nodeMap[actualSwipeArray[this.currentIndex]];
    var menu_type = itemData.menu_type;
    var parent_nid = itemData.parent_nid;

    this.props.navigation.setParams({
      headerTitle: nodeMap[parent_nid].title,
      parentSwipeId: parent_nid,
    });

    if (menu_type !== 'news_feed') {
      var bred = [];
      var parent_nid_array = [actualSwipeArray[this.currentIndex], parent_nid];
      do {
        var parent_data = nodeMap[parent_nid];
        if (parent_data !== undefined) {
          parent_nid = parent_data.parent_nid;
          if (nodeMap[parent_nid] !== undefined) {
            parent_nid_array.push(parent_nid);
          }
        } else {
          parent_nid = undefined;
        }
      } while (parent_nid !== undefined);
      bred = parent_nid_array;
      this.setState({showBreadCrumb: true, breadCrumsElementArray: bred});
    } else {
      this.setState({showBreadCrumb: false});
    }

    this.setState({
      actualSwipeArray,
    });
  }

  renderBreadCrumb = ({item, index}) => {
    let {nodeMap, navigation} = this.props;
    let {breadCrumsElementArray} = this.state;
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={Theme.customOpacity.opacity}
        onPress={() =>
          this.navigateFromBreadCrumb(
            index,
            navigation,
            nodeMap,
            breadCrumsElementArray,
          )
        }>
        <View style={styles.breadcrumbItemContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.breadCrumbTags,
              {
                maxWidth: width / 1.8,
                fontFamily:
                  index === 0 ? Theme.fonts.semibold : Theme.fonts.regular,
              },
            ]}>
            {S(nodeMap[item].title).stripTags().decodeHTMLEntities().trim().s}
          </Text>
          {index !== breadCrumsElementArray.length - 1 ? (
            <SimpleLineIcons
              name="arrow-right"
              size={20}
              color={Theme.customColor.nodeTitle}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    let {actualSwipeArray, showBreadCrumb} = this.state;
    return (
      <View style={{flex: 1}}>
        {showBreadCrumb ? (
          <View style={styles.breadCrumbContainer}>
            <FlatList
              extraData={this.state}
              data={this.state.breadCrumsElementArray}
              renderItem={this.renderBreadCrumb}
              style={{flex: 1}}
              horizontal={true}
              keyExtractor={item => item.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}
        <Carousel
          style={{flex: 1}}
          currentPage={this.currentIndex}
          isLooped={true}
          onAnimateNextPage={snapToIndex => this.onSwipeChange(snapToIndex)}
          autoplay={false}
          ref={c => {
            this._carousel = c;
          }}
          arrows={false}
          leftArrowText={'⟨'}
          leftArrowStyle={{color: '#f28c1f', fontSize: 32, margin: 12}}
          rightArrowText={'⟩'}
          rightArrowStyle={{color: '#f28c1f', fontSize: 32, margin: 12}}>
          {actualSwipeArray.map((item, index) => {
            return this._renderItem(item, index);
          })}
        </Carousel>
        <FooterContainer {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  viewContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: 'black',
    textAlign: 'center',
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: Theme.fonts.regular,
  },
  breadCrumbTags: {
    color: Theme.customColor.breadCrumbTag, //'#005744',
    fontSize: isTablet ? wp('2.8%') : wp('4%'),
    paddingRight: 5,
  },
  arrowStyleLeft: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 50,
    left: 4,
  },
  arrowStyleRight: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 50,
    right: 5,
  },
  breadCrumbContainer: {
    height: hp('5.5%'),
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: Theme.customColor.breadCrumbContainer,
  },
  breadcrumbItemContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
});

const getFavNids = data => data.map(d => d.nid);

const mapStateToProps = state => {
  return {
    nodeMap: state.nodeMap.nodeMap,
    swipeArrayNodes: state.swipeArray.swipeArrayNodes,
    restrictionSwipeArrayNodes: state.swipeArray.restrictionSwipe,
    languageCode: 'en',
    favourites: getFavNids(state.favourites),
    tags: state.tags.data.entities,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addFavourite: data => dispatch(creator.addFavourite(data)),
    removeFavourite: data => dispatch(creator.removeFavourite(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CarousalView);
