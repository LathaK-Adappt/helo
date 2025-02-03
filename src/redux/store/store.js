import reducers from '../reducers/combineReducers';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createNetworkMiddleware } from 'react-native-offline';
import rootSaga from '../sagas';
import { persistStore, persistReducer } from 'redux-persist'
// import FSStorage, { DocumentDir } from 'redux-persist-fs-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage'

const persistConfig = {
  timeout: 10000,
  key: 'root',
  keyPrefix: '',
  storage: FilesystemStorage,
  blacklist: ['network']
};

const persistedReducer = persistReducer(persistConfig, reducers);

const sagaMiddleware = createSagaMiddleware();
const networkMiddleware = createNetworkMiddleware({
  queueReleaseThrottle: 200,
});

const enhancer = applyMiddleware(networkMiddleware, sagaMiddleware);

 export const store = createStore(persistedReducer, enhancer, persistor);
 
 export const persistor = persistStore(store);
 sagaMiddleware.run(rootSaga);
