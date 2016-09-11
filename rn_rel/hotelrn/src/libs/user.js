import {
    User,
} from '@ctrip/crn'

export function login() {
  return new Promise((resolve, reject) => {
    User.userLogin((flags, userinfo) => {
      resolve({
        flags,
        userinfo,
      });
    });
  });
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    User.getUserInfo((status, userinfo) => {
      if (userinfo && userinfo.data && userinfo.data.Auth) {
        resolve(userinfo);
      } else {
        reject(new Error("Fail to get userinfo"))
      }
    });
  });
}
