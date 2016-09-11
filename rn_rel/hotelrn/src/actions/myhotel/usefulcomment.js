import * as C from '../../constants';
import {log} from '../../libs/log';
import {HotelURL} from '../../libs/url';

function createUsefulCommentCountDataView(data){
  if(data && data.useful) {
      return {
          usefulCount: data.useful.usernum|0,
          usefulNotifiedDate: data.useful.ttime,
      };
  }else{
      return {
        usefulCount: 0,
      };
  }
}

function createUsefulCommentListDataView(data){
  if(data && data.cmts && data.cmts.length) {
      return {
          usefulPage: data.page|0,
          usefulList: data.cmts,
      };
  }else{
      return { };
  }
}

export function fetchUsefulCommentCount() {
  const countPayload = {
    searchinfo: {flag:2}
  };

  return async (dispatch, getState, {api}) => {
    try{
      log('loading comment useful info');
      const response = await api.getUserInfo(countPayload);
      const parsedResult = createUsefulCommentCountDataView(response);
      dispatch({
        type: C.COMMENT_USEFUL_COUNT_SUCCESS,
        payload: parsedResult,
        meta: {
          request: countPayload,
          response,
        },
      });

      if (parsedResult && parsedResult.usefulCount) {
        const listPayload = {
          flag: 1,
          ndate: parsedResult.usefulNotifiedDate,
          idx: 1,
        }
        log('loading comment useful list');
        const response = await api.getUsefulNoticeList(countPayload);

        dispatch({
          type: C.COMMENT_USEFUL_LIST_SUCCESS,
          payload: createUsefulCommentListDataView(response),
          meta: {
            request: listPayload,
            response
          },
        })

      }

    } catch (e){
      log('fail to load comment useful info', e);
    }
  }
}

export function gotoMyUsefulComment() {
  //alert('goto my pics');
  HotelURL.openURL('http://m.ctrip.com/webapp/hotel/commentusefulnoticelist/')
  return {
    type: C.GOTO_MY_USEFUL_COMMENT,
  }
}
