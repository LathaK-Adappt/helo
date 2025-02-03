import React, {PureComponent} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {navigateHelper} from '../utils/navigations/navigationHelper';
import creator from '../redux/actionCreators';
import FooterContainer from './Footer';
import Theme from '../styles/Theme';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class Favourites extends PureComponent {
  onNavigate = data => {
    const {navigation, nodeMap} = this.props;
    let nodeData = nodeMap[data.nid];
    navigateHelper(nodeData, navigation, nodeMap);
  };

  renderItem = element => {
    const {item, index} = element;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.onNavigate(item)}
        style={styles.rowFront}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </TouchableOpacity>
    );
  };

  renderHiddenItem = element => {
    const {item, index} = element;
    return (
      <TouchableOpacity
        style={styles.rowBack}
        onPress={() => this.props.removeFavourite(item)}>
        <View style={styles.unfavContainer}>
          <Icon name="heart-dislike-outline" size={18} style={styles.icon} />
          <Text style={styles.unfavText}>Unfavourite</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    let {favourite} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {favourite && Array.isArray(favourite) && favourite.length ? (
          <SwipeListView
            initialNumToRender={15}
            data={favourite}
            overScrollMode={'always'}
            renderItem={(item, idx) => this.renderItem(item, idx)}
            keyExtractor={item => `favourite_item_${item.nid}`}
            renderHiddenItem={(item, idx) => this.renderHiddenItem(item, idx)}
            rightOpenValue={-100}
            stopRightSwipe={-100}
            stopLeftSwipe={50}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../assets/no_fav.png')}
              style={{width: wp('75%'), height: wp('75%'), marginBottom: 30}}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: Theme.customColor.black,
                fontFamily: Theme.fonts.medium,
                marginBottom: 20,
              }}>
              No favourites Found!
            </Text>
          </View>
        )}
        <FooterContainer {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    color: Theme.customColor.nodeTitle,
    marginLeft: wp('2%'),
    padding: wp('3%'),
    fontFamily: Theme.fonts.semibold,
  },
  body: {
    fontSize: 16,
    marginBottom: wp('3%'),
    width: wp('90%'),
    alignSelf: 'center',
    fontFamily: Theme.fonts.regular,
    color: '#494949',
    lineHeight: 24,
  },
  rowFront: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#999',
    backgroundColor: 'white',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ee3349',
    flex: 1,
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
  },
  icon: {
    color: '#ffff',
  },
  unfavText: {
    color: '#ffff',
    fontSize: 14,
    fontFamily: Theme.fonts.regular,
  },
  unfavContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});
const mapStateToProps = state => {
  return {
    favourite: state.favourites,
    nodeMap: state.nodeMap.nodeMap,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    removeFavourite: data => dispatch(creator.removeFavourite(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Favourites);
