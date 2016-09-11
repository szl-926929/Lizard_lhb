import {ABTEST_SUCCESS} from '../constants'
import {log} from '../libs/log';

export function getAbTestResult(abtestid,force) {
  const payload = {"tname":abtestid}

  return async (dispatch, getState, {api}) => {
    try{
      log('loading abtest');
      const response = await api.getAbResult(payload);
      return dispatch({
        type: ABTEST_SUCCESS,
        payload: createDataView(response, payload),
        meta: {
          request: payload
        },
      })
    } catch (e){
      log('fail to load abtest', e);
    }
  }
}

function createDataView(data, request){
  if (data && data.rc) {
      if(data.rc==200){
        return {
          id:request.tname,
          result:data.tresult,
          message:data.rmsg
        }
      }
      if(data.rc>=400 && data.rc<400){
        return {
          id:request.tname,
          result:"NA",
          message:data.rmsg
        }
      }
  } else {
      return {
        id:request.tname,
        result:undefined
      };
  }
}
