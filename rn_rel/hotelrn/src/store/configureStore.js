import reducers from '../reducers';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import promise from '../middlewares/promise';
import array from '../middlewares/array';
import analytics from '../middlewares/analytics';
import api from '../apis';

const isDebuggingInChrome = __DEV__ ;//&& !!window.navigator.userAgent;

const injectedThunk = thunk.withExtraArgument({api});
const middlewares = [injectedThunk, promise, array, analytics,];

if (__DEV__) {
  const logger = require('redux-logger')({collapsed: true});
  middlewares.push(logger);
}

export default function configureStore(onComplete) {
  const store = applyMiddleware(...middlewares)(createStore)(reducers);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}
