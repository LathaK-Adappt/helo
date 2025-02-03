import React from 'react';
import {Snackbar} from 'react-native-snackbar-material';
import Theme from '../styles/Theme';

export function handleSuccessSnackbar(content) {
  Snackbar.info({
    content: content,
    position: 'bottom',
    actionTextColor: 'white',
    margin: 30,
    duration: 2,
    theme: 'light',
    contentStyle: {
      fontSize: 16,
      fontFamily: Theme.fonts.regular,
    },
  });
}
