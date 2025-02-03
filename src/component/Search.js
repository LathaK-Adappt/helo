import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SearchItem from './SearchItem';
import creator from '../redux/actionCreators';
import Theme from '../styles/Theme';
import FooterContainer from './Footer';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {searchText: '', searchPattern: null};
    this.onChangeText = this.onChangeText.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillMount = () => {
    this.props.clearSearch();
  };
  componentWillUnmount = () => {
    this.props.clearSearch();
  };

  componentWillReceiveProps() {
    this.textInput.clear();
  }

  onChangeText(text) {
    this.setState({
      searchText: text,
    });

    if (text && text.length >= 3) {
      this.props.reqSearch({str: text});
    } else {
      this.props.clearSearch();
    }
  }

  onCancel() {
    this.setState({
      searchText: '',
    });
    this.props.clearSearch();
  }

  _renderItem = ({item}) => {
    const {searchText} = this.state;
    const {navigation, nodeMap} = this.props;
    return (
      <SearchItem
        nodeMap={nodeMap}
        data={item}
        nav={navigation}
        searchText={searchText}
      />
    );
  };

  render() {
    const {searchText} = this.state;
    const {navigation, searchList} = this.props;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#016ab6'} barStyle="light-content" />
        <View
          style={{
            backgroundColor: '#d6e7f5',
            padding: 10,
            flexDirection: 'row',
          }}>
          <TextInput
            style={styles.inputText}
            onChangeText={text => this.onChangeText(text)}
            placeholder="Search here"
            underlineColorAndroid="transparent"
            maxLength={24}
            autoCorrect={false}
            //autoFocus={true}
            ref={input => (this.textInput = input)}
            value={searchText}
          />
          {searchText.length > 0 ? (
            <View style={styles.searchIconContainer}>
              <TouchableOpacity
                onPress={() => this.onCancel()}
                style={styles.inputClose}>
                <Icon name="times-circle" color="#ffffff" size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.searchIconContainer}>
              <SimpleLineIcons
                name="magnifier"
                color="#ffffff"
                size={16}
                style={styles.searchIcon}
              />
            </View>
          )}
        </View>

        {searchList && searchList.length !== 0 ? (
          <FlatList
            data={searchList}
            keyExtractor={item => item.nid.toString()}
            renderItem={this._renderItem}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../assets/no_search.png')}
              style={{width: wp('55%'), height: wp('55%'), marginBottom: 30}}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: Theme.customColor.black,
                fontFamily: Theme.fonts.medium,
                marginBottom: 20,
              }}>
              No Search Yet!
            </Text>
          </View>
        )}
        <FooterContainer {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  searchIconContainer: {
    height: 45,
    padding: 8,
    margin: 5,
    marginLeft: 0,
    width: wp('12%'),
    backgroundColor: '#f32c46',
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    height: 45,
    width: wp('80%'),
    padding: 8,
    borderWidth: 1,
    borderColor: '#fff',
    margin: 5,
    marginRight: 0,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: '#fff',
    paddingLeft: 35,
    paddingRight: 25,
    fontSize: 18,
  },
});
const mapStateToProps = state => {
  return {
    searchList: state.search.searchList,
    nodeMap: state.nodeMap.nodeMap,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    reqSearch: data => dispatch(creator.reqSearchList(data.str)),
    clearSearch: () => dispatch(creator.clearSearchList()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
