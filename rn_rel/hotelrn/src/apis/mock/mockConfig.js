import { Modes } from './Constants';
const {Resolve, Reject, ByPass} = Modes;

export default {
  'Origin/OrderList/Query': [
    {
      mode: Resolve,
      result: require('./Data/Origin/OrderList/Query.json'),
      delay: 0,
      predicate: (request) => true,
    }
  ],
  'External_GS/GetRecommendHotelAskList': [
    {
      mode: Resolve,
      result: require('./Data/External_GS/GetRecommendHotelAskList.json'),
      delay: 0,
      predicate: (request) => false,
    }
  ],
  'Customer/UserPicStatus': [
    {
      mode: Resolve,
      result: require('./Data/Customer/UserPicStatus.json'),
      delay: 0,
      predicate: (request) => true,
    }
  ],
  'Booking/UserInfoSearch': [
    {
      mode: Resolve,
      result: require('./Data/Booking/UserInfoSearch.json'),
      delay: 0,
      predicate: (request) => false,
    }
  ],
  'Customer/getrewards': [
    {
      mode: Resolve,
      result: require('./Data/Customer/getrewards.json'),
      delay: 0,
      predicate: (request) => true,
    }
  ],
  'Customer/abtestresult': [
    {
      mode: Resolve,
      result: require('./Data/ABTest/abtestresult.json'),
      delay: 0,
      isABTest:true,
      predicate: (request) => true,
    }
  ],
};
