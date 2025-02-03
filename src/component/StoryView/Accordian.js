import React, {PureComponent} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import HTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LANGUAGES} from '../../constants';
import {navigateHelper} from '../../utils/navigations/navigationHelper';
import Theme from '../../styles/Theme';
import {RenderHtmlStyles} from '../../styles/RenderHtmlStyles';

const CUSTOM_STYLES = {};
const CUSTOM_CLASSES = {
  approach: {
    backgroundColor: '#e8e8e8',
    padding: 10,
  },
};

class Accordian extends PureComponent {
  constructor() {
    super();
    this.state = {
      indexes: [],
      chapters: [],
      contents: [],
    };
  }

  componentWillMount = () => {
    this.setState({
      chapters: [],
      contents: [],
    });
    let _contents = [],
      _chapters = [];

    if (this.props.data && this.props.data.field_accordian_header) {
      this.props.data.field_accordian_header.map((item, index) => {
        if (item.field_accordian) {
          item.field_accordian.map((items, index) => {
            _contents.push(items);
            _chapters.push(item.field_header);
          });
        }
      });
      this.setState({
        chapters: _chapters,
        contents: _contents,
      });
    }
  };

  _renderHeader = (section, index, isActive) => {
    const {
      sectionHeadView,
      HeaderTextView,
      HeaderIconView,
      HeaderIcon,
      HeaderText,
    } = styles;
    const {primaryColor, accordianBgIsNotActive, colorWhite, textColor} =
      Theme.customColor;
    const DEFAULT_PROPS = {
      tagsStyles: RenderHtmlStyles.CUSTOM_TAGSSTYLE,
      classesStyles: RenderHtmlStyles.CUSTOM_CLASSES,
    };
    var htmlBody = section && section.field_title ? section.field_title : ' ';
    return (
      <View key={index} style={{marginBottom: isActive ? 0 : 5}}>
        {section && (
          <View
            style={[
              {
                backgroundColor: isActive
                  ? primaryColor
                  : accordianBgIsNotActive,
              },
              sectionHeadView,
            ]}>
            <View style={HeaderTextView}>
              <HTML
                {...DEFAULT_PROPS}
                baseFontStyle={{
                  color: isActive ? colorWhite : textColor,
                  fontSize: 16,
                  fontFamily: Theme.fonts.medium,
                }}
                containerStyle={{margin: 10}}
                defaultTextProps={{selectable: true}}
                source={{html: htmlBody}}
              />
            </View>
            <View style={HeaderIconView}>
              {isActive && (
                <Icon
                  style={HeaderIcon}
                  color={colorWhite}
                  size={18}
                  name="angle-up"
                />
              )}
              {!isActive && (
                <Icon
                  style={HeaderIcon}
                  color={textColor}
                  size={18}
                  name="angle-down"
                />
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  nodeRedirect = data => {
    if (data && data.translations) {
      let _itemsLang = data.translations.map(d => {
        return d.lang;
      });
      let index = _itemsLang.indexOf(this.props.lanCode);
      if (index > -1) {
        const nID = data.translations[index].nid;
        var nodeData = this.props.nodeMap.get(nID);
        const {nav, nodeMap, nodeUpdateInfoMap} = this.props;
        navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, null);
      } else {
        // Redirect TO English Node
      }
    } else {
      // Redirect TO English Node
    }
  };

  componentWillReceiveProps = nextProps => {
    this.setState({
      chapters: [],
      contents: [],
    });
    let _contents = [],
      _chapters = [];
    if (nextProps && nextProps.data && nextProps.data.field_accordian_header) {
      nextProps.data.field_accordian_header.map((item, index) => {
        if (item.field_accordian) {
          item.field_accordian.map((items, index) => {
            _contents.push(items);
            _chapters.push(item.field_header);
          });
        }
      });
      this.setState({
        chapters: _chapters,
        contents: _contents,
      });
    }
  };

  _renderContent = (section, index) => {
    const {ContentView} = styles;
    const DEFAULT_PROPS = {
      htmlStyles: CUSTOM_STYLES,
      tagsStyles: RenderHtmlStyles.CUSTOM_TAGSSTYLE,
      classesStyles: CUSTOM_CLASSES,
    };
    return (
      <View key={index} style={ContentView}>
        {section && (
          <HTML {...DEFAULT_PROPS} source={{html: section.field_content}} />
        )}
      </View>
    );
  };

  renderSectionTitle = (content, index, isActive) => {
    const DEFAULT_PROPS = {
      tagsStyles: RenderHtmlStyles.CUSTOM_TAGSSTYLE,
      classesStyles: RenderHtmlStyles.CUSTOM_CLASSES,
    };
    var htmlBody = this.state.chapters[index];
    return (
      <View>
        {this.state.chapters[index - 1] !== this.state.chapters[index] ? (
          <View style={{marginBottom: 5, marginTop: 8}}>
            <HTML
              {...DEFAULT_PROPS}
              baseFontStyle={styles.chapterHeader}
              defaultTextProps={{selectable: true}}
              source={{html: htmlBody}}
            />
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <View style={{margin: 13}}>
        <Accordion
          activeSections={this.state.indexes}
          onChange={indexes => this.setState({indexes})}
          sections={this.state.contents}
          renderSectionTitle={this.renderSectionTitle}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          underlayColor="transparent"
          touchableComponent={props => <TouchableOpacity {...props} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chapterHeader: {
    fontSize: 16,
    color: Theme.customColor.black,
    fontFamily: Theme.fonts.medium,
  },
  sectionHeadView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderTextView: {
    flex: 0.9,
  },
  HeaderText: {
    fontSize: 16,
    padding: 10,
    fontFamily: Theme.fonts.medium,
  },
  HeaderIconView: {
    flex: 0.1,
  },
  HeaderIcon: {
    paddingLeft: 10,
  },
  ContentView: {
    padding: 13,
    marginBottom: 5,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Theme.customColor.accordianBgIsNotActive, //'#F2F2F2'
  },
});
export default Accordian;
