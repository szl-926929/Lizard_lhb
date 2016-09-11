import * as C from '../../constants';

export default function myfavorite(state = {}, action) {
  switch (action.type) {
    case C.MY_FAVORITE_HOTELS_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    default:
  }
  return state;
}
