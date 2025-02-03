import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  TouchableHighlight,
  Modal,
  ScrollView,
} from 'react-native';
import Theme from '../../styles/Theme';
import {RenderHtmlStyles} from '../../styles/RenderHtmlStyles';
const CUSTOM_STYLES = {};
class DecisionTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: [0],
      history: [],
      data: null,
      modalVisible: false,
    };
  }
  componentWillMount() {
    const field_decision_trees_json =
      this.props.decision_tree_data.field_decision_trees_json;
    const parsedData =
      field_decision_trees_json && JSON.parse(field_decision_trees_json);
    this.data = parsedData && new Map(parsedData);
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      output: [0],
      history: [],
      data: null,
    });
    if (nextProps.decision_tree_data !== this.props.decision_tree_data) {
      const field_decision_trees_json =
        nextProps.decision_tree_data.field_decision_trees_json &&
        nextProps.decision_tree_data.field_decision_trees_json;
      const parsedData =
        field_decision_trees_json && JSON.parse(field_decision_trees_json);
      this.data = parsedData && new Map(parsedData);
    }
  }

  _onPress(nextStep, length, position, whichArray) {
    let newOutput = this.state.output;
    let newHistory = this.state.history;
    newHistory.splice(position, newHistory.length);
    newHistory[position] = whichArray;
    let _posIdx = newOutput.indexOf(position);
    let _nextIdx = newOutput.indexOf(nextStep);
    if (_nextIdx > -1 && _posIdx > -1) {
      newOutput.splice(_posIdx + 1, newOutput.length);
      newOutput.push(nextStep);
    } else if (_nextIdx > -1) {
      newOutput.splice(_nextIdx, newOutput.length);
    } else {
      if (length > 1 && _posIdx > -1) {
        newOutput.splice(_posIdx + 1, newOutput.length);
      }
      newOutput.push(nextStep);
    }
    this.setState({
      output: newOutput,
      history: newHistory,
    });
  }

  renderItem(item, length, position, isLast, whichArray, shouldHighlight) {
    let {report1, report2} = item ? item : {};
    let {
      field_is_syphilis_,
      field_report1_bg_,
      field_report2_bg_,
      field_active_bg_,
    } =
      this.props && this.props.decision_tree_data
        ? this.props.decision_tree_data
        : {};
    if (item && item.onClick) {
      return {
        jsx: (
          <TouchableOpacity
            activeOpacity={0.7}
            key={whichArray}
            style={[
              styles.itemClickable,
              !isLast ? styles.itemClickableBorder : null,
              shouldHighlight
                ? {
                    backgroundColor: field_is_syphilis_
                      ? field_active_bg_
                      : Theme.customColor.primaryColor,
                  }
                : null,
            ]}
            onPress={() =>
              this._onPress(
                item.onClick,
                length,
                position,
                whichArray,
                shouldHighlight,
              )
            }>
            <Text
              style={[
                styles.itemClickableText,
                shouldHighlight
                  ? {color: Theme.customColor.colorWhite}
                  : {color: Theme.customColor.black},
              ]}>
              {`${item.title}`}
            </Text>
          </TouchableOpacity>
        ),
        isLabel: false,
      };
    }
    return {
      jsx: (
        <View
          key={whichArray}
          style={{flex: 1, borderRadius: 5, overflow: 'hidden'}}>
          {field_is_syphilis_ ? (
            <View style={{borderRadius: 5}}>
              {report1 && (
                <Text
                  style={[
                    styles.syphilisItemText,
                    {backgroundColor: field_report1_bg_},
                  ]}>{`${report1}`}</Text>
              )}
              {report2 && (
                <Text
                  style={[
                    styles.syphilisItemText,
                    {backgroundColor: field_report2_bg_},
                  ]}>{`${report2}`}</Text>
              )}
            </View>
          ) : (
            <View style={{padding: 10}}>
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
          )}
        </View>
      ),
      isLabel: true,
    };
  }

  renderRow() {
    let {field_is_syphilis_, field_active_bg_} =
      this.props && this.props.decision_tree_data
        ? this.props.decision_tree_data
        : {};
    let output = this?.state?.output?.map((position, i) => {
      let label = this?.data?.get(position)?.map((item, i, arr) => {
        if (i === 0 && item?.label !== '') {
          return (
            <View style={styles.label} key={i}>
              <Text style={styles.labelText}>{item?.label}</Text>
            </View>
          );
        } else {
          return null;
        }
      });
      let innerOutput = this?.data?.get(position)?.map((item, i, arr) => {
        let shouldHighlight = i === this.state.history[position];
        let whichArray = i;
        const isLast = arr.length - 1 === i;
        if (i !== 0) {
          return this?.renderItem(
            item,
            arr.length,
            position,
            isLast,
            whichArray,
            shouldHighlight,
          );
        }
        return <View />;
      });
      let isLabel = false;
      let finalInnerOutput = innerOutput?.map(item => {
        isLabel = item?.isLabel;
        return item?.jsx;
      });
      return (
        <View key={i}>
          <View
            style={[
              styles.row,
              {padding: !isLabel ? 10 : 0},
              isLabel
                ? [
                    styles.reportRow,
                    {
                      borderColor: field_is_syphilis_
                        ? field_active_bg_
                        : Theme.customColor.primaryColor,
                      backgroundColor: field_is_syphilis_ ? '#FFF' : '#d2e1c4',
                    },
                  ]
                : null,
            ]}>
            {label}
            <View
              style={[styles.options, !isLabel ? styles.optionsBorder : null]}>
              {finalInnerOutput}
            </View>
          </View>
          {!isLabel ? (
            Platform.OS === 'android' ? (
              <View style={styles.arrowContainer}></View>
            ) : (
              <View style={styles.arrowContainer}>
                <View style={styles.triangle} />
                <View style={styles.square} />
              </View>
            )
          ) : null}
        </View>
      );
    });
    return output;
  }

  render() {
    let {field_is_syphilis_, field_modal_text_} =
      this.props && this.props.decision_tree_data
        ? this.props.decision_tree_data
        : {};
    const DEFAULT_PROPS = {
      htmlStyles: CUSTOM_STYLES,
      tagsStyles: RenderHtmlStyles.CUSTOM_TAGSSTYLE,
    };
    return <View style={styles.container}>{this.renderRow()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 25,
  },
  row: {
    backgroundColor: Theme.customColor.colorWhite, //'#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowColor: Theme.customColor.decisionTreeshadowColor, //'#717171',
    shadowOpacity: 0.5,
    borderRadius: 5,
    borderColor: Platform.OS === 'android' ? '#ccc' : '#eee',
    borderWidth: 1,
  },
  reportRow: {
    shadowOpacity: 0,
  },
  label: {
    marginBottom: 10,
  },
  labelText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 18,
    paddingVertical: 2,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
  },
  optionsBorder: {
    borderColor: Theme.customColor.primaryColor, //'#0f5745',
    borderWidth: 1,
    borderRadius: 5,
  },
  itemClickable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    backgroundColor: 'transparent',
  },
  itemClickableText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  itemClickableBorder: {
    borderColor: Theme.customColor.primaryColor, //'#0f5745',
    borderRightWidth: 1,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: Theme.fonts.regular,
  },
  syphilisItemText: {
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontFamily: Theme.fonts.medium,
    fontSize: 16,
    color: '#666',
  },
  active: {
    backgroundColor: Theme.customColor.primaryColor, //'#0f5745',
  },
  activeText: {
    color: Theme.customColor.colorWhite, //'#fff'
  },
  arrowContainer: {
    height: 30,
    flex: 1,
    alignItems: 'center',
    zIndex: 10,
    position: 'relative',
    top: -1,
  },
  triangle: {
    borderTopWidth: 15,
    borderRightWidth: 30 / 2.0,
    borderBottomWidth: 0,
    borderLeftWidth: 30 / 2.0,
    borderTopColor: Theme.customColor.colorWhite, //'#fff',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    shadowOffset: {width: 0, height: 2},
    borderStyle: 'solid',
    shadowColor: '#818181',
    shadowOpacity: 0.5,
  },
  square: {
    width: 30,
    height: 5,
    position: 'absolute',
    top: -5,
    backgroundColor: Theme.customColor.colorWhite, //'#fff'
  },
});

export default DecisionTree;
