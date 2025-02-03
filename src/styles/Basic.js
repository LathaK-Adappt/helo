import {StyleSheet, Dimensions} from 'react-native';
import Theme from './Theme';
let winSize = Dimensions.get('window');

const Basic = StyleSheet.create({
  text: {
    fontSize: 32 / winSize.scale,
  },
  headerTitleStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    height: 50,
  },
  textStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontFamily: Theme.fonts.medium,
    textTransform: 'uppercase',
  },
});
export default Basic;
