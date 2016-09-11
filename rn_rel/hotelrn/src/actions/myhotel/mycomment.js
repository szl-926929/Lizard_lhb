import * as C from '../../constants';
import cUtilDate from '../../libs/Common/Util/cUtilDate';
import {HotelURL} from '../../libs/url';
import {log,warn} from '../../libs/log';
import * as User from '../user';

function createCommentBriefDataView(data){
  const detail = data.orders && data.orders[0];
  const total = data.total || 0;
  if(detail) {
    var now = new cUtilDate().format('Y-m-d');
    var cdata= new cUtilDate(now);
    var limitIn = cdata.getIntervalDay(cUtilDate.parse(detail.cidate).format('Y-m-d'), now),
        limitOut = cdata.getIntervalDay(now, cUtilDate.parse(detail.codate).format('Y-m-d'));
      return {
          hotelId: detail.htlid,
          hotelName: detail.htlname,
          hotelCount: total,
          description: `${cUtilDate.parse(detail.cidate).format('m.d')}-${cUtilDate.parse(detail.codate).format('m.d')} 入住`,
          limitIn:limitIn,
          limitOut:limitOut,
          hotelType: detail.biz,
          orderId: detail.oid
      };
  }else{
      return {};
  }
}

export function fetchCommentBriefData() {
  const payload = {
    "ver":1,
    "flag":4,
    "osts":0,
    "pnum":1,
    "size":1,
    "alliance":{
      "ishybrid":0
    }
  };

  return async (dispatch, getState, {api}) => {
    try{
      log('loading comment brief');
      const response = await api.getOrderList(payload);
      return dispatch({
        type: C.COMMENT_BRIEF_SUCCESS,
        payload: createCommentBriefDataView(response),
        meta: {
          request: payload,
          response
        },
      })
    } catch (e){
      log('fail to load comment brief', e);
    }
  }
}

export function gotoCommentId(orderId, hotelId, hotelName, pageId) {
  //alert('goto comment id: ' + id);
  HotelURL.openURL(`ctrip://wireless/HotelCommentSubmit?orderId=${orderId}&hotelId=${hotelId}&hotelName=${hotelName}`)
  return {
    type: C.GOTO_COMMENT,
  }
}

export function gotoAllMyComments(version,newVersionRemark) {
  //alert('goto all my comment');
  return async (dispatch) =>{
    try{
      await dispatch(User.getUserInfo(true));
      HotelURL.openURL(`http://m.ctrip.com/webapp/hotel/faketab?tab=1&isfromrn=1&over=${version}&nver=${newVersionRemark}`,'我的点评');
      return {
        type: C.GOTO_MY_ALL_COMMENTS,
      }
    } catch(e){
      warn(e);
    }
  }
}

// export function gotoAllMyPendingComments() {
//   alert('goto all my pending comment');
//   return {
//     type: C.GOTO_MY_PENDING_COMMENTS,
//   }
// }

export function gotoIntegralRule() {
  //alert('goto all my comment');
  HotelURL.openURL('http://m.ctrip.com/webapp/hotel/integralrule?isfromrn=1','点评积分规则');
  return {
    type: C.GOTO_INTEGRAL_RULE,
  }
}
