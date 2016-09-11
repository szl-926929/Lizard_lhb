import * as C from '../../constants';

export default function mycoupon(state = {}, action) {
  switch (action.type) {
    case C.MY_COUPON_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    default:
  }
  return state;
}
