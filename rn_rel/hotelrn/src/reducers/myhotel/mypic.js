import * as C from '../../constants';

export default function myPic(state = {}, action) {
  switch (action.type) {
    case C.USER_PIC_STATUS_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    default:
  }
  return state;
}
