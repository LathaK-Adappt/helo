import React, {PureComponent} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  FlatList,
  alert,
} from 'react-native';
import HTML from 'react-native-render-html';
import {RenderHtmlStyles} from '../../styles/RenderHtmlStyles';
import {
  navigateHelper,
  navigateReplaceWithAnimation,
} from '../../utils/navigations/navigationHelper';
import Theme from '../../styles/Theme';
import {getNodeData} from '../../utils/getNodeData';
import {filedownload} from './filedownload';
import Image from '../ScalableImage';
const externalNotificationMsg =
  'This is an external link. Do you want to leave WHO HIV Tx ?';

var RNFS = require('react-native-fs');

const {width, height} = Dimensions.get('window');
const IMAGES_MAX_WIDTH = width - 150;
const CUSTOM_STYLES = {};

class StoryViewBody extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      referenceId: '',
      sectionsData: {},
      loaderVisible: true,
      data: null,
      nid: null,
      willmount: false,
      bodyLength: '',
      disabled: false,
    };
  }

  componentWillMount = () => {
    const {bodylength} = this.props;
    this.setState({
      willmount: true,
      bodyLength: bodylength,
    });

    this.timeout = setTimeout(
      () =>
        this.setState(
          {
            loaderVisible: false,
          },
          () => {
            this.props.showLoader(false);
          },
        ),
      300,
    );
  };

  componentDidMount() {}

  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  componentWillReceiveProps = (nextProps) => {
    const {bodylength} = nextProps;
    const {data} = this.props;
    this.setState({bodyLength: bodylength});
    if (nextProps.data.nid !== data.nid) {
      this.setState(
        {
          willmount: false,
          loaderVisible: true,
        },
        () => {
          this.props.showLoader(true);
        },
      );
      setTimeout(
        () =>
          this.setState(
            {
              loaderVisible: false,
            },
            () => {
              this.props.showLoader(false);
            },
          ),
        300,
      );
    }
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  nodeData(nid, nodeMap) {
    this.readNodeData(nid);
  }

  readNodeData = (nid) => {
    var that = this;
    if (this.props.nodeIds && this.props.nodeIds.indexOf(nid) > -1) {
      global.db.getNodeData(nid).then((data) => {
        if (data) {
          that.nodeRedirect(result);
        } else {
        }
      });
    } else {
      let readNodeData =
        Platform.OS === 'ios'
          ? RNFS.readFile(
              `${RNFS.MainBundlePath}/data/nodes/node_${nid}.json`,
              'utf8',
            )
          : RNFS.readFileAssets(`data/nodes/node_${nid}.json`, 'utf8');
      readNodeData
        .then((result) => {
          var parsedLocalNodeData = JSON.parse(result);
          that.nodeRedirect(parsedLocalNodeData);
        })
        .catch((error) => {
          // console.log('error ', error);
        });
    }
  };

  nodeRedirect = (data) => {
    if (data && data.translations) {
      let _itemsLang = data.translations.map((d) => {
        return d.lang;
      });
      let index = _itemsLang.indexOf(this.props.languageCode);
      if (index > -1) {
        const nID = data.translations[index].nid;
        var nodeData = this.props.nodeMap[nID];
        const {nav} = this.props;
        navigateHelper(nodeData, nav, nodeMap);
      }
    }
  };

  onLinkPress = (href, attr) => {
    const {nav, nodeMap, nodeUpdateInfoMap} = this.props;
    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);
    if (!this.state.disabled) {
      this.setState({disabled: true});
      const {nodeMap, nodeUpdateInfoMap, languageCode} = this.props;
      if (href.indexOf('node') > -1 && href.match(/\d+/g)) {
        var nodeLink = href.match(/\d+/g);
        var nid = nodeLink[0];
        var updateInfo = nodeUpdateInfoMap && nodeUpdateInfoMap[nid];
        var nodeData = this.props.nodeMap && this.props.nodeMap[nid];
        console.log(nid,'data')
        if (nodeData && nodeData !== undefined) {
          navigateHelper(nodeData, nav, nodeMap);
        } else {
          Alert.alert(
            'Notification',
            externalNotificationMsg,
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {
                text: 'Ok',
                onPress: () =>
                  Linking.openURL(href).catch((err) =>
                    console.log(`Error Occured: ${err.message}`),
                  ),
              },
            ],
            {cancelable: false},
          );
        }
      } else if (href.search(/#\d|#foot.*/) > -1) {
        this.setState({referenceId: href});
        this.setModalVisible(true);
      } else {
        if (attr.title) {
          filedownload(attr.title);
        } else if (href.match(regex)) {
          Alert.alert(
            'Notification',
            externalNotificationMsg,
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {
                text: 'Ok',
                onPress: () =>
                  Linking.openURL(href).catch((err) =>
                    console.log(`Error Occured: ${err.message}`),
                  ),
              },
            ],
            {cancelable: false},
          );
        } else {
          var referString =
            href && href ? (href.length > 10 ? 'the Article' : href) : '';
          referString = referString.replace('#table', 'Table ');
          referString = referString.replace('#box', 'Box ');
          referString = referString.replace('#figure', 'Figure ');
          referString = referString.replace('#fig', 'Figure ');
          referString = referString.replace('#image', 'Image ');
          Alert.alert(
            'Notification',
            `Please refer to ${referString}`,
            [{text: 'Ok', onPress: () => {}, style: 'ok'}],
            {cancelable: false},
          );
        }
      }
      setTimeout(() => {
        this.setState({
          disabled: false,
        });
      }, 3000);
    }
  };

  render() {
    const {data, nav, searchText, menulistItems} = this.props;
        const CUSTOM_RENDERERS = {
      img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        var CurWidth, Curheight;
        if (htmlAttribs.hasOwnProperty('style') === false) {
          CurWidth = width - 50;
          Curheight = 200;
        } else {
          var res = htmlAttribs.style.split(';');
          var Imgwidth = res
            .filter((str) => str.indexOf('width') > -1)[0]
            .match(/\d+/g)
            .map(Number)[0];
          var Imgheight =
            res[1] == 'height:auto' ? 200 : res[1].match(/\d+/g).map(Number);

          CurWidth = width - 50;
          Curheight = (Imgheight / Imgwidth) * CurWidth;
        }
        return htmlAttribs.class === 'resize' ? (
          <Image
            source={{uri: htmlAttribs.src}}
            width={width > 700 ? width / 2 : width - 30}
            style={{
              alignSelf: 'center',
              width: convertedCSSStyles.width,
              height: convertedCSSStyles.height,
              marginLeft:
                Platform.OS === 'ios'
                  ? htmlAttribs.class === 'keyimg'
                    ? -19
                    : 0
                  : htmlAttribs.class === 'keyimg'
                  ? 0
                  : 0,
            }}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={Theme.customOpacity.opacity}
            key={passProps.nodeIndex}
            onPress={() => {
              let myParams = {
                data: htmlAttribs.src,
                width: Imgwidth,
                height: Imgheight,
              };
              nav.navigate('StoryViewImageZoom', {myParams});
            }}>
            {htmlAttribs.class === 'resources' ? (
              <Image
                width={width > 700 ? width / 2 : width - 30}
                source={{uri: htmlAttribs.src}}
                style={{
                  alignSelf: 'center',
                  width: width > 700 ? 365 : CurWidth,
                  height: width > 700 ? 550 : Curheight,
                  marginRight: width > 700 ? 20 : 0,
                  resizeMode: 'contain',
                }}
              />
            ) : (
              <Image
              width={width > 700 ? width / 2 : width - 30}
              source={{uri: htmlAttribs.src}}
                style={{
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  width: CurWidth,
                  height: Curheight,
                  marginLeft:
                    Platform.OS === 'ios'
                      ? htmlAttribs.class === 'keyimg'
                        ? -19
                        : 0
                      : htmlAttribs.class === 'keyimg'
                      ? 0
                      : 0,
                }}
              />
            )}
          </TouchableOpacity>
        );
      },
      ol: (htmlAttribs, children, convertedCSSStyles, passProps = {}) => {
        const {nodeIndex, key, baseFontStyle} = passProps;
        const baseFontSize = baseFontStyle.fontSize || 14;
        children =
          children &&
          children.map((child, index) => {
            return (
              <View
                key={`list-${nodeIndex}-${index}-${key}`}
                style={{flexDirection: 'row', marginBottom: 10}}>
                <Text
                  key={`ol-${index}-${key}`}
                  style={{
                    marginRight: 5,
                    color: '#595959',
                    fontSize: 17,
                    lineHeight: 22,
                  }}>
                  {index + 1}
                  {`.`}
                </Text>
                <View style={{flex: 1}}>{child}</View>
              </View>
            );
          });

        return (
          <FlatList
            style={{flexGrow: 0, flexShrink: 0}}
            key={passProps.nodeIndex}
            data={children}
            keyExtractor={(item, index) => item.key}
            removeClippedSubviews={true}
            renderItem={({item}) => item}
            onEndReachedThreshold={0.8}
            maxToRenderPerBatch={120}
            initialNumToRender={60}
            updateCellsBatchingPeriod={0}
          />
        );
      },
    };
    const DEFAULT_PROPS = {
      htmlStyles: CUSTOM_STYLES,
      renderers: CUSTOM_RENDERERS,
      tagsStyles: RenderHtmlStyles.CUSTOM_TAGSSTYLE,
      imagesMaxWidth: IMAGES_MAX_WIDTH,
      classesStyles: RenderHtmlStyles.CUSTOM_CLASSES,
      onLinkPress: (evt, href, attr) => this.onLinkPress(href, attr),
    };
    const numberOfDigits = Math.floor(
      Math.log(data.body.length) / Math.LN10 + 1,
    );

    var a = this.props.data.title.toUpperCase();
    var b =
      this.state.bodyLength == undefined
        ? a
        : this.state.bodyLength.toUpperCase();

    var htmlBody = data.body;
    if (searchText !== null && searchText !== undefined) {
      var _searchText = searchText;
      var addBackslashWithSplChar = _searchText.replace(
        /([\[\]<>*()?])/g,
        '\\$1',
      );
      // highlight search keyword on outside of html tag
      var regex = new RegExp(
        addBackslashWithSplChar +
          '(?!([^<])*?>)(?!<script[^>]*?>)(?![^<]*?</script>|$)',
        'gi',
      );
      htmlBody = htmlBody.replace(
        regex,
        `<a style="color: #666; background-color: yellow">$&</a>`,
      );
    }
    return (
      <View style={styles.container}>
        {this.state.loaderVisible === false || a === b ? (
          <HTML
            {...DEFAULT_PROPS}
            imagesMaxWidth={Dimensions.get('window').width - 200}
            source={{html: htmlBody}}
          />
        ) : // <Text>{htmlBody}</Text>
        numberOfDigits >= 5 ? (
          <ActivityIndicator
            size="small"
            color={Theme.customColor.colorWhite}
            style={styles.activityIndicator}
          />
        ) : this.state.willmount ? (
          <ActivityIndicator
            size="small"
            color={Theme.customColor.colorWhite}
            style={styles.activityIndicator}
          />
        ) : null}
        {this.props.data.field_tagging &&
        this.props.sectionTags &&
        this.props.sectionsItem &&
        this.state.loaderVisible === false &&
        a === b ? (
          <StoryTagsView
            SECTIONS_Tags={this.props.sectionTags}
            sectionsData={this.props.sectionsItem}
            nav={this.props.nav}
            nodeMap={this.props.nodeMap}
            nodeUpdateInfoMap={this.props.nodeUpdateInfoMap}
            languageCode={this.props.languageCode}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.customColor.colorWhite,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
  },
  activityIndicator: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
    height: 80,
  },
});

export default StoryViewBody;
