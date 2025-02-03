import React, {Component} from 'react';
import {View, Dimensions, Image, Text} from 'react-native';
import PhotoView from 'react-native-photo-view';

class StoryViewImageZoom extends Component {
  render() {
    let imgData =
      this.props &&
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.myParams
        ? this.props.route.params.myParams.data
        : null;
    return (
      <View
        style={{backgroundColor: '#000', flex: 1, justifyContent: 'center'}}>
        {imgData && (
          <PhotoView
            source={{uri: imgData}}
            minimumZoomScale={1}
            maximumZoomScale={4}
            style={{flex: 1}}
          />
        )}
      </View>
    );
  }
}

export default StoryViewImageZoom;
