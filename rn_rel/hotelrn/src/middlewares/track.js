// const {AppEventsLogger} = require('react-native-fbsdk');
//
// import type {Action} from '../actions/types';

export default action => {
  if (!action || !action.type) {
    return;
  }
  // switch (action.type) {
  //   case 'LOGGED_IN':
  //     //AppEventsLogger.logEvent('Login', 1, {source: action.source || ''});
  //     break;
  //
  //   case 'LOGGED_OUT':
  //     //AppEventsLogger.logEvent('Logout', 1);
  //     break;
  // }
}
