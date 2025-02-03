/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import {navigateHelper} from '../utils/navigations/navigationHelper';
import Theme from '../styles/Theme';

const slides = [
  require('../assets/slides/slide_1.jpg'),
  require('../assets/slides/slide_1.jpg'),
  require('../assets/slides/slide_2.jpg'),
  require('../assets/slides/slide_3.jpg'),
  require('../assets/slides/slide_4.jpg'),
];
const CarouselComponent = ({data, nav, nodeMap}) => {
  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 18,
            color: '#fff',
            paddingHorizontal: 20,
            fontFamily: Theme.fonts.semibold,
          }}>
          Quick links{' '}
        </Text>
      </View>
      <Carousel
        style={styles.carousel}
        bullets
        bulletStyle={{
          backgroundColor: '#5d8aad',
          height: 10,
          width: 10,
          marginTop: 10,
          marginHorizontal: 5,
          borderColor: '#5d8aad',
        }}
        chosenBulletStyle={{
          backgroundColor: '#cae0ef',
          borderColor: '#78a8d1',
          borderWidth: 3,
          height: 13,
          width: 13,
          marginHorizontal: 5,
        }}>
        {data.map((item, index) => (
          <View key={item} style={styles.slide}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(42,86,121,.6)',
                borderRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 30,
                width: '85%',
                minHeight: 150,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => navigateHelper(item, nav, nodeMap)}>
              {/* <ImageBackground
                source={slides[index]}
                resizeMode="cover"
                imageStyle={{borderRadius: 25}}
                style={{width: width - 100, borderRadius: 20, height: 150}}> */}
              <Text
                style={styles.text}
                numberOfLines={4}
                allowFontScaling={false}>
                {item.title}
              </Text>
              {/* </ImageBackground> */}
            </TouchableOpacity>
          </View>
        ))}
      </Carousel>
    </>
  );
};

const styles = StyleSheet.create({
  carousel: {
    flex: 0.3,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:30,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Theme.fonts.medium,
    lineHeight: 24,
  },
});

export default CarouselComponent;
