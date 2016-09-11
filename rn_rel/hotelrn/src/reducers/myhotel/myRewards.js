import * as C from '../../constants';

export default function myRewards(state = {}, action) {
  switch (action.type) {
    case C.MY_REWARDS_HOTELS_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    default:
  }
  return state;
}
