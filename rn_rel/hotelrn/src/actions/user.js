import * as User from '../libs/user.js';
import {warn} from '../libs/log.js';
import * as C from '../constants';

export function getUserInfo(requireLogin) {
  return async (dispatch) => {
    try{
      if (requireLogin) {
        await User.login();
      }
      var userInfo = await User.getUserInfo();
      dispatch({
        type: C.USERINFO_RECEIVED,
        payload: userInfo,
      })
    } catch(e) {
      warn('[UserInfo] Get UserInfo Error');
      throw e;
    }

  }
}
