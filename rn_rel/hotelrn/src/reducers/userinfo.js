import {USERINFO_RECEIVED} from '../constants'

export default function userinfo(state = {
  data:{},
}, action) {
  switch (action.type) {
    case USERINFO_RECEIVED:
      return {
        ...state,
        ...action.payload
      };
    default:
  }
  return state;
}
