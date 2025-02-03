import React, {Component, Fragment, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {LANGUAGES} from '../../constants';
let deviceWidth = Dimensions.get('window').width;

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicine: '',
      agedata: '',
      regimen: '',
      result: '',
      medicineName: '',
      ageName: '',
      weightName: '',
    };
  }

  selectMedicine(idx) {
    const {name, value} = idx;
    let {field_decision_trees_json} =
      this.props && this.props.data ? this.props.data : {};
    const data =
      field_decision_trees_json && JSON.parse(field_decision_trees_json);
    this.setState({
      medicine: value,
      medicineName: name,
      agedata: '',
      ageName: '',
      result: '',
      regimen: data[value] && data[value].regimen ? data[value].regimen : [],
    });
    return `${name}`;
  }
  selectAge(idx) {
    const {name, value} = idx;
    let {field_decision_trees_json} =
      this.props && this.props.data ? this.props.data : {};
    const data =
      field_decision_trees_json && JSON.parse(field_decision_trees_json);
    this.setState({
      agedata: value,
      ageName: name,
      weightName: '',
      result:
        data[this.state.medicine] && data[this.state.medicine].isWeight
          ? ''
          : value,
    });
    return `${name}`;
  }
  selectWeight(idx) {
    const {name, value} = idx;
    this.setState({
      result: value,
      weightName: name,
    });
    return `${name}`;
  }
  dropdown_renderRow(rowData) {
    return (
      <View style={[styles.dropdown_2_row, {backgroundColor: 'white'}]}>
        <Text style={[styles.dropdown_2_row_text]}>{`${rowData.name}`}</Text>
      </View>
    );
  }
  dropdown1_renderRow(rowData) {
    return (
      <View style={[styles.dropdown_2_row, {backgroundColor: 'white'}]}>
        <Text style={[styles.dropdown_2_row_text]}>{`${rowData.name}`}</Text>
      </View>
    );
  }

  render() {
    const {
      medicine,
      agedata,
      regimen,
      result,
      medicineName,
      ageName,
      weightName,
    } = this.state;
    let {field_decision_trees_json} =
      this.props && this.props.data ? this.props.data : {};
    const data =
      field_decision_trees_json && JSON.parse(field_decision_trees_json);

    return (
      <View style={{flex: 1}}>
        {data && data ? (
          <ScrollView style={styles.Container}>
            <View style={styles.menuContainer}>
              <View style={{flex: 1, marginTop: 20}}>
                <View style={styles.labelContainer}>
                  <Text style={styles.borderText}>{'MEDICINE'}</Text>
                </View>
                <View style={[styles.borderContainer]}>
                  <ModalDropdown
                    ref="dropdown_1"
                    style={{margin: 5, marginLeft: 10}}
                    textStyle={styles.dropdown_2_text}
                    dropdownStyle={{
                      ...styles.dropdown_2_dropdown,
                      ...{
                        height: data['medicines'].length >= 5 ? 240 : 120,
                      },
                    }}
                    options={data['medicines']}
                    renderRow={this.dropdown_renderRow.bind(this)}
                    renderButtonText={(rowData) =>
                      this.selectMedicine(rowData)
                    }>
                    <View style={{flexDirection: 'row', paddingTop: 6}}>
                      <View style={{flex: 10}}>
                        <Text
                          style={{
                            ...styles.containerText,
                            ...{color: medicineName ? '#696969' : '#B8B8B8'},
                          }}
                          numberOfLines={1}>
                          {medicineName ? medicineName : 'Please select'}
                        </Text>
                      </View>
                    </View>
                  </ModalDropdown>
                </View>
              </View>
              {medicine ? (
                <View style={{flex: 1, marginTop: 20}}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.borderText}>{'AGE'}</Text>
                  </View>
                  <View style={[styles.borderContainer]}>
                    <ModalDropdown
                      ref="dropdown_2"
                      style={{margin: 5, marginLeft: 10}}
                      textStyle={styles.dropdown_2_text}
                      dropdownStyle={{
                        ...styles.dropdown_2_dropdown,
                        ...{
                          height: data[medicine].age.length >= 4 ? 180 : 100,
                        },
                      }}
                      options={data[medicine].age}
                      renderRow={this.dropdown_renderRow.bind(this)}
                      renderButtonText={(rowData) => this.selectAge(rowData)}>
                      <View style={{flexDirection: 'row', paddingTop: 6}}>
                        <View style={{flex: 10}}>
                          <Text
                            style={{
                              ...styles.containerText,
                              ...{color: ageName ? '#696969' : '#B8B8B8'},
                            }}
                            numberOfLines={1}>
                            {ageName ? ageName : 'Please select'}
                          </Text>
                        </View>
                      </View>
                    </ModalDropdown>
                  </View>
                </View>
              ) : null}
              {data[medicine] && data[medicine].isWeight && agedata ? (
                <View style={{flex: 1, marginTop: 20}}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.borderText}>{'WEIGHT'}</Text>
                  </View>
                  <View style={[styles.borderContainer]}>
                    <ModalDropdown
                      ref="dropdown_3"
                      style={{margin: 5, marginLeft: 10}}
                      textStyle={styles.dropdown_2_text}
                      dropdownStyle={{
                        ...styles.dropdown_2_dropdown,
                        ...{
                          height:
                            data[medicine][agedata].length >= 4 ? 180 : 100,
                        },
                      }}
                      options={data[medicine][agedata]}
                      renderRow={this.dropdown_renderRow.bind(this)}
                      renderButtonText={(rowData) =>
                        this.selectWeight(rowData)
                      }>
                      <View style={{flexDirection: 'row', paddingTop: 6}}>
                        <View style={{flex: 10}}>
                          <Text
                            style={{
                              ...styles.containerText,
                              ...{color: weightName ? '#696969' : '#B8B8B8'},
                            }}
                            numberOfLines={1}>
                            {weightName ? weightName : 'Please select'}
                          </Text>
                        </View>
                      </View>
                    </ModalDropdown>
                  </View>
                </View>
              ) : null}
              {regimen && result ? (
                <View>
                  <View style={styles.doseContainer}>
                    <Text style={styles.doseHeader}>
                      Dose by age and weight band
                    </Text>
                  </View>
                  <View style={styles.doseBody}>
                    <Image
                      source={require('../../assets/guidelines/drug.png')}
                      style={styles.doseIcon}
                    />
                    <Text style={styles.resultText} numberOfLines={5}>
                      {result}{' '}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                    }}>
                    <View style={styles.RegimenContainer}>
                      <Text style={styles.RegimenHeader}>Regimen</Text>
                    </View>
                    <Text style={styles.resultTextTwo}>{regimen} </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{textAlign: 'center', color: 'black'}}>
              {LANGUAGES[0].noContentLabel}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  doseContainer: {
    backgroundColor: '#6baddf',
    marginTop: 30,
  },
  doseHeader: {
    color: 'white',
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    fontFamily: 'AvenirNextCondensed-Regular',
    alignSelf: 'center',
  },
  doseBody: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#6baddf',
    borderTopWidth: 0,
    padding: 2,
  },
  doseIcon: {
    width: 50,
    height: 50,
    marginRight: 5,
    marginLeft: 5,
    alignSelf: 'center',
  },
  RegimenContainer: {
    backgroundColor: '#6baddf',
  },
  RegimenHeader: {
    color: 'white',
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    fontFamily: 'AvenirNextCondensed-Regular',
    alignSelf: 'center',
  },
  assess: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  timer: {
    fontFamily: 'AvenirNextCondensed-DemiBold',
    fontSize: 18,
    color: '#c38204',
    paddingLeft: 6,
  },
  notes: {
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F4BF59',
    backgroundColor: '#f9f9f9',
  },
  resultText: {
    fontFamily: 'AvenirNextCondensed-Bold',
    fontSize: 16,
    color: '#404040',
    padding: 5,
    display: 'flex',
    flexWrap: 'wrap',
    textAlignVertical: 'center',
    alignSelf: 'center',
    marginRight: 20,
    width: '80%',
  },
  resultTextTwo: {
    fontFamily: 'AvenirNextCondensed-Bold',
    fontSize: 16,
    color: '#404040',
    padding: 10,
    borderWidth: 1,
    borderColor: '#6baddf',
    borderTopWidth: 0,
  },
  menuContainer: {
    margin: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
  switchView: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  switchText: {
    fontSize: deviceWidth > 330 ? 16 : 14,
    color: '#4A4A4A',
    fontFamily: 'AvenirNextCondensed-Bold',
  },
  notesText: {
    color: '#595959',
    fontSize: 17,
    fontFamily: 'AvenirNextCondensed-Regular',
    marginBottom: 8,
  },
  symptomLabel: {
    fontSize: 18,
    fontFamily: 'AvenirNextCondensed-Bold',
    padding: 6,
  },
  symptomView: {
    borderWidth: 1,
    borderColor: '#F4BF59',
    borderRadius: 10,
    paddingBottom: 8,
  },
  dropdown_2: {
    marginTop: 32,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#F5F5F5',
    width: '95%',
    alignSelf: 'center',
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'black',
    textAlignVertical: 'center',
    width: '90%',
  },
  dropdown_2_dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
    width: '87%',
    alignSelf: 'center',
  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: -12,
    left: 10,
    paddingTop: 5,
    paddingHorizontal: 8,
    zIndex: 50,
  },
  borderContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#C4C4C4',
    justifyContent: 'center',
  },
  containerText: {
    color: '#696969',
    fontSize: 16,
    textTransform: 'uppercase',
    fontFamily: 'AvenirNextCondensed-Bold',
  },
  borderText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontFamily: 'AvenirNextCondensed-DemiBold',
  },
});
