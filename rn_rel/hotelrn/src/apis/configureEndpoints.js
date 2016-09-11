import {SERVICE_NS} from './Constants';
import {createServiceDefinition} from './createServiceDefinition';

const serviceDefinitions = {
  getOrderList: createServiceDefinition({
    ns: SERVICE_NS.Origin,
    name: 'OrderList/Query',
    timeout: 10000
  }),
  getRecommendHotelAskList: createServiceDefinition({
    ns: SERVICE_NS.External_GS,
    name: 'GetRecommendHotelAskList',
    timeout: 10000
  }),
  getUserPicStatus: createServiceDefinition({
    ns: SERVICE_NS.Customer,
    name: 'UserPicStatus',
    timeout: 10000
  }),
  getHotelUserCoupon: createServiceDefinition({
    ns: SERVICE_NS.Customer,
    name: 'HotelUserCouponSearch',
    timeout: 10000
  }),
  getUserInfo: createServiceDefinition({
    ns: SERVICE_NS.Booking,
    name: 'UserInfoSearch',
    timeout: 10000
  }),
  getUsefulNoticeList: createServiceDefinition({
    ns: SERVICE_NS.Booking,
    name: 'UsefulNoticeList',
    timeout: 10000
  }),
  getFavoriteHotels: createServiceDefinition({
    ns: SERVICE_NS.Origin,
    name: 'Favorite/QueryV2',
    timeout: 10000
  }),
  getAbResult:createServiceDefinition({
    ns:SERVICE_NS.Customer,
    name:'abtestresult',
    timeout:10000
  }),
  getUserRewards:createServiceDefinition({
      ns:SERVICE_NS.Customer,
      name : 'getrewards',
      timeout:10000,
  }),
  getPictureList:createServiceDefinition({
      ns:SERVICE_NS.Product,
      name : 'picturelist',
      timeout:10000,
  })
};

export default function configureEndpoints(createEndpoint){
  const serviceClient = {};
  Object.keys(serviceDefinitions).forEach(key => {
    const definition = serviceDefinitions[key];
    serviceClient[key] = createEndpoint(definition)
  });

  return Object.freeze(serviceClient);
}
