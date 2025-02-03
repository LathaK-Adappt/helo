import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Image,
} from 'react-native';
import StoryViewBody from './StoryViewBody';
import {STORE_URL} from '../../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import {LANGUAGES} from '../../constants';
import S from '../../utils/string';
import {getNodeData} from '../../utils/getNodeData';
import Theme from '../../styles/Theme';
import {RenderHtmlStyles} from '../../styles/RenderHtmlStyles';
import Accordian from './Accordian';
import HTML from 'react-native-render-html';
import DeviceInfo from 'react-native-device-info';
import DecisionTree from './DecisionTree';
import Calculator from './Calculator';
const isTablet = DeviceInfo.isTablet();
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Menulist from './Menulist';

class StoryView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      willmount: true,
      shareText1: '',
      shareText2: '',
      noContent: '',
      showLoader: true,
      isLoaded: false,
    };
    this.scroll = null;
    this.someRef = {};
    this.SECTIONS_Tags = [];
    this.SECTIONS = {};
    this.showLoader = this.showLoader.bind(this);
  }

  async componentDidMount() {
    const {languageCode, nid, nodeMap, tags} = this.props;
    const data = await getNodeData(nid, nodeMap, tags);

    if (data) {
      this.setState({isLoaded: true});
      this.setState({data});
    }
    if (languageCode) {
      let _langObj = LANGUAGES.filter(lang => lang.code === languageCode);
      if (_langObj.length) {
        const {shareText1, shareText2, noContent} = _langObj[0];
        this.setState({
          shareText1,
          shareText2,
          noContent,
        });
      }
    }

    setTimeout(() => {
      this.setState({willmount: false});
    }, 500);
  }

  togglefav = (selectedData, isSet) => {
    const {languageCode} = this.props;
    let decodeArticle = selectedData.body
      ? S(selectedData.body).stripTags().decodeHTMLEntities().trim().s
      : '';
    decodeArticle = decodeArticle.replace(/\+/g, ' ');
    let decodeArticleRemoveSpace = decodeArticle.replace(/\s+/g, ' ');

    let favData = {
      nid: parseInt(selectedData.nid, 10),
      title: selectedData.title,
      body: `${
        decodeArticleRemoveSpace && decodeArticleRemoveSpace.substring(0, 160)
      }...`,
      language: languageCode,
      translations: selectedData.translations,
    };

    if (isSet) {
      this.props.addFavourite(favData);
    } else {
      this.props.removeFavourite(favData);
    }
  };

  shareOptions() {
    let {nid, languageCode, nodeMap} = this.props;
    let {shareText1, shareText2} = this.state;
    const {appStoreURL, playStoreURL, deepLinkURL, emailSubject} = STORE_URL;
    let deepLinkURLWithParams = `${deepLinkURL}?node=${nid}&language=${languageCode}`;

    let url =
      `${shareText1}\n\n` +
      `${deepLinkURLWithParams}\n\n` +
      `${shareText2}\n\n` +
      `iOS: ${appStoreURL},\n\n` +
      `Android: ${playStoreURL}`;
    Share.share({
      title: this.state.data.title,
      message: url,
      subject: 'WHO HIV Tx',
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.nid !== this.props.nid) {
      this.setState({willmount: false});
      const {nid, nodeMap, tags} = nextProps;
      const data = await getNodeData(nid, nodeMap, tags);

      if (data) {
        this.setState({data});
      }
    }
    if (this.scrollView) {
      this.scrollView.scrollTo({x: 0, y: 0, animated: true});
    }
  }

  showLoader = val => {
    this.setState({showLoader: val});
  };
  renderView = () => {
    const {paramNid, navigation, languageCode, nodeMap, itemData, title} =
      this.props;
    const {data} = this.state;
    const {searchText} = '';
    switch (itemData.menu_type) {
      case 'content':
      case 'content-menulist':
        return (
          <StoryViewBody
            languageCode={this.props.languageCode}
            showLoader={this.showLoader}
            paramNid={paramNid}
            bodylength={this.props.itemData.title}
            data={data}
            nav={navigation}
            nodeMap={nodeMap}
            searchText={searchText}
            menulistItems={
              this.props.itemData && this.props.itemData.deeperlink
                ? this.props.itemData.deeperlink
                : []
            }
          />
        );
      case 'accord':
        return (
          <Accordian
            lanCode={languageCode}
            data={data}
            nav={navigation}
            nodeMap={nodeMap}
          />
        );
      case 'decision_tree':
        return data &&
          data.field_temp_mirror_fix &&
          data.field_temp_mirror_fix === 'yes' ? (
          <Calculator
            nav={navigation}
            nodeMap={nodeMap}
            languageCode={this.props.languageCode}
            data={data}
          />
        ) : (
          <DecisionTree
            nav={navigation}
            nodeMap={nodeMap}
            languageCode={this.props.languageCode}
            decision_tree_data={this.state.data}
          />
        );
      default:
        break;
    }
  };

  debounce(callback, wait, context = this) {
    let timeout = null;
    let callbackArgs = null;
    const later = () => callback.apply(context, callbackArgs);
    return () => {
      callbackArgs = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  render() {
    const {menu_type, title, nid} = this.props.itemData;
    const {breadCrumsElementArray, favourites, nodeMap} = this.props;
    const DEFAULT_PROPS = {
      tagsStyles: {i: {fontFamily: Theme.fonts.fontItalic, fontSize: 17}},
      classesStyles: RenderHtmlStyles.CUSTOM_CLASSES,
    };

    return (
      <View style={{flex: 1}}>
        {this.state.willmount ||
        (this.state.data === null && isLoaded == true) ? (
          <ActivityIndicator
            size="small"
            color={Theme.customColor.contentLoaderColor}
            style={styles.activityIndicator}
          />
        ) : (this.state.data.body == null || this.state.data.body === '') &&
          (menu_type === 'content' ||
            menu_type === 'mirror_content' ||
            menu_type === 'content-menulist') ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../../assets/no_content.png')}
              style={{width: wp('75%'), height: wp('75%'), marginBottom: 30}}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: Theme.customColor.black,
                fontFamily: Theme.fonts.medium,
                marginBottom: 20,
                paddingHorizontal: 20,
              }}>
              {LANGUAGES[0].noContentLabel}
            </Text>
          </View>
        ) : this.state.data.body != null ||
          menu_type === 'accord' ||
          menu_type === 'decision_tree' ? (
          <View style={styles.body}>
            <ScrollView
              style={styles.mainContent}
              ref={ref => (this.scrollView = ref)}
              contentContainerStyle={{flexGrow: 1}}>
              {/* CONTENT TITLE */}
              {menu_type !== 'news_feed' && (
                <View style={styles.viewContainer}>
                  <HTML
                    {...DEFAULT_PROPS}
                    baseFontStyle={{
                      fontSize: isTablet ? wp('3%') : wp('4.3%'),
                      fontWeight: 'bold',
                      fontFamily: Theme.fonts.medium,
                      color: Theme.customColor.nodeTitle,
                      textAlign: 'center',
                    }}
                    source={{html: title}}
                  />
                </View>
              )}

              {/* FAVOURITE AND SHARE FEATURES */}
              {this.state.data.field_hide_share &&
              this.state.data.field_hide_share ==
                1 ? null : breadCrumsElementArray.indexOf(nid) > -1 ? (
                <View
                  style={[
                    {backgroundColor: Theme.customColor.colorWhite},
                    styles.bottomToolBar,
                  ]}>
                  {favourites.indexOf(Number(nid)) > -1 ? (
                    <TouchableOpacity
                      activeOpacity={Theme.customOpacity.opacity}
                      onPress={() => {
                        this.togglefav(this.state.data, false);
                      }}>
                      <Icon
                        size={isTablet ? 32 : 24}
                        name="heart"
                        style={styles.bottomToolBarIcon}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={Theme.customOpacity.opacity}
                      onPress={() => {
                        this.togglefav(this.state.data, true);
                      }}>
                      <Icon
                        size={isTablet ? 32 : 24}
                        name="hearto"
                        style={styles.bottomToolBarIcon}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    activeOpacity={Theme.customOpacity.opacity}
                    onPress={this.debounce(() => this.shareOptions(), 200)}>
                    <Icon
                      size={isTablet ? 32 : 24}
                      name="sharealt"
                      style={styles.bottomToolBarIcon}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{height: 50}} />
              )}

              {/* RENDERING COMPONENT BASED ON MENU_TYPE */}
              {this.state.data.body !== null ? this.renderView() : null}

              {/* RENDERING CONTENT MENULIST COMPONENT */}
              {menu_type === 'content-menulist' ? (
                <Menulist
                  data={this.props.itemData.deeperlink}
                  navigation={this.props.navigation}
                  nodeMap={nodeMap}
                />
              ) : null}
            </ScrollView>
          </View>
        ) : (
          <ActivityIndicator
            size="small"
            color={Theme.customColor.colorWhite}
            style={styles.activityIndicator}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Theme.customColor.colorWhite,
  },
  bottomToolBar: {
    height: isTablet ? 60 : 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomToolBarIcon: {
    padding: 12,
    color: Theme.customColor.primaryColor,
  },
  activityIndicator: {
    flex: 1,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  viewContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: Theme.fonts.medium,
    color: Theme.customColor.nodeTitle,
    paddingTop: 18,
    textAlign: 'center',
  },
  titleNoContent: {
    fontSize: 19,
    color: Theme.customColor.nodeTitle,
    textAlign: 'auto',
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: Theme.fonts.regular,
  },
  nocontent: {
    marginTop: 10,
    color: '#888',
    fontSize: 22,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontFamily: Theme.fonts.regular,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoryView;
