import {ABTEST_SUCCESS} from '../constants'
export default function abTest(state = {}, action) {
  switch (action.type) {
    case ABTEST_SUCCESS:
      return {
        ...state,
        [action.meta.request.tname]:action.payload
      }
    default:
  }
  return state;
}
