import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import { menuReducer as menus } from './menuReducer';
import { versionReducer as version } from './version';
import { tagsReducer as tags } from './tagsReducer';
import { carouselReducer as carousel } from './carouselReducer';
import { searchReducer as search } from './searchReducer';
import { languageReducer as language } from './languageReducer';
import { reducer as network } from 'react-native-offline';
import { syncReducer as synMessage } from './syncStatus';
import { nodeMapReducer as nodeMap } from './nodeMapReducer';
import { swipeArrayReducer as swipeArray } from './swipeArrayReducer';
import { favouriteReducer as favourites } from './favouriteReducer';
import shareNode from './shareNode';

const appState = reduceReducers({ syncStatus: '', showSyncStatus: false, language: 'en' }, synMessage);
const reducers = combineReducers({
  menus,
  tags,
  search,
  language,
  version,
  network,
  appState,
  nodeMap,
  swipeArray,
  favourites,
  carousel,
  shareNode
});

export default reducers;