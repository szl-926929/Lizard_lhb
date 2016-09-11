import * as C from '../../constants';

export default function commentBrief(state = {}, action) {
  switch (action.type) {
    case C.COMMENT_BRIEF_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    case C.COMMENT_USEFUL_COUNT_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    default:
  }
  return state;
}
