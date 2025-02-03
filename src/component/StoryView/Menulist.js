import React from 'react';
import {
  Text,
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  navigateHelper,
  navigateReplaceWithAnimation,
} from '../../utils/navigations/navigationHelper';
const {width} = Dimensions.get('window');
import Theme from '../../styles/Theme';
import HTML from 'react-native-render-html';
import AntIcon from 'react-native-vector-icons/AntDesign';

const DEFAULT_PROPS = {
  tagsStyles: {i: {fontFamily: Theme.fonts.custFontItalic, fontSize: 16}},
};

const Menulist = ({data, navigation, nodeMap}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* <FlatList
        data={data}
        renderItem={({item, index}) => (
          <MenuListItem
            data={item}
            navigation={navigation}
            index={index}
            nodeMap={nodeMap}
          />
        )}
        keyExtractor={(item) => item.title}
      /> */}
      {data.map((e, index) => {
        return (
          <MenuListItem
            data={e}
            navigation={navigation}
            index={index}
            nodeMap={nodeMap}
            key={index}
          />
        );
      })}
    </View>
  );
};

const MenuListItem = ({data, navigation, index, nodeMap}) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={Theme.customOpacity.opacity}
        onPress={() => {
          navigateHelper(data, navigation, nodeMap);
        }}>
        <View
          style={[
            styles.innerContainer,
            {backgroundColor: index % 2 ? '#fff' : '#eee'},
          ]}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <AntIcon
              name="rightcircle"
              color={Theme.customColor.hamburgerLangChange}
              size={16}
            />
          </View>
          <View style={{flex: 11, paddingRight: 15}}>
            <HTML
              {...DEFAULT_PROPS}
              baseFontStyle={{
                flex: 1,
                fontSize: 17,
                fontFamily: Theme.fonts.regular,
                color: Theme.customColor.primaryColor,
              }}
              source={{html: data.title}}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: width,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  icon: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 16,
    fontFamily: Theme.fonts.regular,
    color: '#101010',
  },
});
export default Menulist;
