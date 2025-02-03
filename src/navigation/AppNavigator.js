import 'react-native-gesture-handler';
import * as React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  Dimensions,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NavigationActions,
} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../component/Home';
import DrawerMenu from '../component/DrawerMenu';
import SquareMenu from '../component/SquareMenu';
import SquareMenuTwo from '../component/SquareMenuTwo';
import MenuList from '../component/MenuList';
import CarousalView from '../component/CarousalView';
import StoryViewImageZoom from '../component/StoryView/StoryViewImageZoom';
import Favourites from '../component/Favourites';
import Search from '../component/Search';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';
import Calculator from '../component/StoryView/Calculator';
const isTablet = DeviceInfo.isTablet();
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Theme from '../styles/Theme';
import {navigationRef} from '../utils/navigations/navigationService';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const {width} = Dimensions.get('window');
/* custom header */

function homeScreensHeaderTitle(props) {
  const {name} = props.route;

  switch (name) {
    case 'SquareMenu':
      let menuTitle = props.route.params.data?.title;
      return (
        <View style={styles.headerTitleStyleSquareMenu}>
          <Text
            style={styles.headerTitleStyle1}
            numberOfLines={1}
            ellipsizeMode="tail">
            {`${menuTitle}`}
          </Text>
        </View>
      );
    case 'MenuList':
      let menuListTitle = props.route.params.data?.title;
      return (
        <View style={styles.headerTitleStyle}>
          <Text
            style={styles.headerTitleStyle1}
            numberOfLines={1}
            ellipsizeMode="tail">
            {`${menuListTitle}`}
          </Text>
        </View>
      );
    case 'CarousalView':
      let title =
        props.route.params && props.route.params.headerTitle
          ? props.route.params.headerTitle
          : props.route.params.params.myParams.title;
      return (
        <View style={styles.headerTitleStyleSquareMenu}>
          <Text
            style={styles.headerTitleStyle1}
            numberOfLines={1}
            ellipsizeMode="tail">
            {`${title}`}
          </Text>
        </View>
      );
    case 'Search':
      return (
        <View style={styles.headerTitleStyleSquareMenu}>
          <Text
            style={styles.headerTitleStyle1}
            numberOfLines={1}
            ellipsizeMode="tail">
            {props.route.name}
          </Text>
        </View>
      );
    case 'Favourites':
      return (
        <View style={styles.headerTitleStyleSquareMenu}>
          <Text
            style={styles.headerTitleStyle1}
            numberOfLines={1}
            ellipsizeMode="tail">
            {props.route.name}
          </Text>
        </View>
      );

    case 'SquareMenuTwo':
      return (
        <Text
          style={styles.headerTitleStyle1}
          numberOfLines={1}
          ellipsizeMode="tail">
          {props.route.name}
        </Text>
      );

    case 'StoryViewImageZoom':
      return (
        <Text
          style={styles.headerTitleStyle1}
          numberOfLines={1}
          ellipsizeMode="tail"></Text>
      );
    default:
      return props.route.name;
  }
}

function HeaderTitle(props) {
  return homeScreensHeaderTitle(props);
}
function headerSection(props) {
  const {route} = props;
  return {
    headerStyle: {
      height: Platform.OS == 'ios' ? hp('13%') : hp('11%'),
    },
    // headerTitleStyle: {
    //   fontSize: isTablet ? wp('4.3%') : wp('4.7%'),
    //   color: 'white',
    //   fontFamily: Theme.fonts.medium,
    //   width: width - 60,
    //   marginLeft: 55,
    //   marginRight: 10,
    // },
    title: route.name.toUpperCase(),
    headerTitle: () => <HeaderTitle {...props} />,
    headerLeft: () => <HeaderLeft {...props} />,
    headerBackground: () => (
      <LinearGradient
        start={{x: 1, y: 0.1}}
        end={{x: 0.01, y: 0.9}}
        colors={['#16618a', '#289bd4']}
        style={styles.header}>
        <Image
          source={require('../assets/header_bg.png')}
          style={styles.headerBG}
        />
      </LinearGradient>
    ),
  };
}
function HeaderLeft(props) {
  const {navigation, route} = props;
  return (
    <TouchableOpacity
      style={styles.leftButton}
      onPress={() => navigation.goBack()}>
      <Icon
        name="arrowleft"
        size={isTablet ? wp('4%') : wp('6%')}
        color="white"
        right={50}
        style={{margin: 10}}
      />
    </TouchableOpacity>
  );
}

function AppNavigator() {
  const ActionBarIcon = navigation => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => navigation.goBack()}>
        <Icon
          name="arrow-back-ios"
          size={21}
          color={'#ffff'}
          style={{paddingLeft: 20}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackVisible: false,
        headerStyle: {
          backgroundColor: '#016ab6',
          height: Platform.OS == 'ios' ? hp('15%') : hp('12%'),
        },
        // headerTitleStyle: {
        //   color: 'white',
        //   fontFamily: Theme.fonts.medium,
        //   fontSize: wp('5.3%'),
        // },
        headerLayoutPreset: 'center',
        headerTintColor: '#ffffff',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SquareMenu"
        component={SquareMenu}
        options={props => headerSection(props)}
      />
      <Stack.Screen
        name="SquareMenuTwo"
        component={SquareMenuTwo}
        options={props => headerSection(props)}
      />
      <Stack.Screen
        name="MenuList"
        component={MenuList}
        options={props => headerSection(props)}
      />
      <Stack.Screen
        name="CarousalView"
        component={CarousalView}
        options={props => headerSection(props)}
      />
      <Stack.Screen
        name="StoryViewImageZoom"
        component={StoryViewImageZoom}
        options={props => headerSection(props)}
      />
      <Stack.Screen
        name="Favourites"
        component={Favourites}
        options={props => headerSection(props)}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={props => headerSection(props)}
      />
    </Stack.Navigator>
  );
}
function DrawerNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          // width: width - 40,
          drawerStyle: {
            width: width - 40,
          },
        }}
        drawerType="front"
        drawerContent={props => (
          <View>
            <DrawerMenu {...props} />
          </View>
        )}>
        <Drawer.Screen name="Root" component={AppNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  leftButton: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    right: 0,
    left: 0,
  },
  headerBG: {
    position: 'absolute',
    width: width / 2.6,
    height: width / 2.5,
    right: 0,
    top: 0,
    resizeMode: 'cover',
  },
  headerTitleStyle1: {
    fontSize: isTablet ? wp('4.3%') : wp('4.7%'),
    fontFamily: Theme.fonts.medium,
    color: 'white',
    alignSelf: 'center',
    textTransform: 'uppercase',
    marginRight: 50,
  },
  headerTitleStyle: {
    width: width - 60,
    // justifyContent:'center',
    // alignItems:'center',
    //marginLeft: 55,

    color: 'white',
    //  marginRight:40
  },
  headerTitleStyleSquareMenu: {
    width: width - 60,
    justifyContent: 'center',
    alignItems: 'center',
    //textAlign:'center',
    color: 'white',
  },
});

export default DrawerNavigator;
