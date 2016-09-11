import * as C from '../../constants';

export default function askBrief(state = {}, action) {
  switch (action.type) {
    case C.ASK_BRIEF_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    default:
  }
  return state;
}
